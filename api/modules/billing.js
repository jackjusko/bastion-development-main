/**
 * Stripe Connect: client customers, coach Express accounts, subscriptions.
 *
 * Platform take-rate is application_fee_percent on each subscription.
 * When STRIPE_SECRET_KEY is unset, methods return local stand-ins so the
 * marketplace can be exercised without charging cards.
 */
const config = require('../config');
const dbModule = require('./database');

const stripeKey = config.stripeSecretKey;
const stripe = stripeKey ? require('stripe')(stripeKey) : null;

function localId(prefix) {
  return `${prefix}_local_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function publicHash(path) {
  return `${config.publicUrl}/#${path}`;
}

/**
 * Create an Express connected account and return the onboarding URL.
 */
exports.createConnectedAccount = function createConnectedAccount(userID) {
  return new Promise(async function (resolve) {
    const userRow = await dbModule.dbGet('SELECT * FROM USER WHERE ID = ?;', [userID]);
    if (!stripe) {
      const accountId = localId('acct');
      await dbModule.dbRun('INSERT INTO BANKING (USERID, STRIPEID) VALUES (?, ?);', [userID, accountId]);
      resolve(publicHash('/coach/dashboard'));
      return;
    }
    const newAccount = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: userRow.EMAIL,
      business_type: 'individual',
      business_profile: { url: 'bastionfit.com' }
    });
    const accountLink = await stripe.accountLinks.create({
      account: newAccount.id,
      refresh_url: publicHash('/coachDashboard'),
      return_url: publicHash('/coachDashboard'),
      type: 'account_onboarding'
    });
    dbModule.dbRun('INSERT INTO BANKING (USERID, STRIPEID) VALUES (?, ?);', [userID, newAccount.id]);
    resolve(accountLink.url);
  });
};

exports.generateLoginLink = function generateLoginLink(userID) {
  return new Promise(async function (resolve) {
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    if (!stripe) {
      resolve(publicHash('/coach/dashboard'));
      return;
    }
    try {
      const loginLink = await stripe.accounts.createLoginLink(bankingRow.STRIPEID);
      resolve(loginLink.url);
    } catch (err) {
      resolve(await exports.generateOnboardingLink(userID));
    }
  });
};

exports.checkActive = function checkActive(userID) {
  return new Promise(async function (resolve) {
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    if (!bankingRow) {
      resolve(0);
      return;
    }
    if (!stripe) {
      resolve(1);
      return;
    }
    const userAccount = await stripe.accounts.retrieve(bankingRow.STRIPEID);
    resolve(userAccount.payouts_enabled);
  });
};

exports.generateOnboardingLink = function generateOnboardingLink(userID) {
  return new Promise(async function (resolve) {
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    if (!bankingRow) {
      resolve(0);
      return;
    }
    if (!stripe) {
      resolve(publicHash('/coach/dashboard'));
      return;
    }
    const accountLink = await stripe.accountLinks.create({
      account: bankingRow.STRIPEID,
      refresh_url: publicHash('/coachDashboard'),
      return_url: publicHash('/coachDashboard'),
      type: 'account_onboarding'
    });
    resolve(accountLink.url);
  });
};

exports.createProduct = function createProduct(name, description) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve({ id: localId('prod'), name, description });
      return;
    }
    const newProduct = await stripe.products.create({ name, description });
    resolve(newProduct);
  });
};

exports.createPrice = function createPrice(cents, productid) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve({ id: localId('price') });
      return;
    }
    const price = await stripe.prices.create({
      unit_amount: cents,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: productid
    });
    resolve(price);
  });
};

exports.createCustomer = function createCustomer(userID) {
  return new Promise(async function (resolve) {
    const userRow = await dbModule.dbGet('SELECT * FROM USER WHERE ID = ?;', [userID]);
    if (!stripe) {
      const customerId = localId('cus');
      await dbModule.dbRun('INSERT INTO BANKING (USERID, STRIPEID) VALUES (?, ?);', [userID, customerId]);
      resolve(customerId);
      return;
    }
    const customer = await stripe.customers.create({
      email: userRow.EMAIL,
      name: userRow.NAME,
      description: 'Bastion Member'
    });
    await dbModule.dbRun('INSERT INTO BANKING (USERID, STRIPEID) VALUES (?, ?);', [userID, customer.id]);
    resolve(customer.id);
  });
};

exports.createSetupSession = function createSetupSession(userID, returnURL) {
  if (!returnURL) {
    returnURL = publicHash('/dashboard');
  }
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve(returnURL);
      return;
    }
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      success_url: returnURL,
      customer: bankingRow.STRIPEID,
      payment_method_types: ['card']
    });
    resolve(session.url);
  });
};

exports.createPortalSession = function createPortalSession(userID) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve(publicHash('/dashboard'));
      return;
    }
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    const session = await stripe.billingPortal.sessions.create({
      return_url: publicHash('/dashboard'),
      customer: bankingRow.STRIPEID
    });
    resolve(session.url);
  });
};

exports.checkPaymentMethod = function checkPaymentMethod(userID) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve(1);
      return;
    }
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    const paymentMethods = await stripe.customers.listPaymentMethods(bankingRow.STRIPEID, { type: 'card' });
    resolve(paymentMethods.data.length > 0 ? 1 : 0);
  });
};

exports.createSubscription = function createSubscription(userID, pricingID) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve(localId('sub'));
      return;
    }
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    const pricingRow = await dbModule.dbGet('SELECT * FROM PRICINGS_STRIPE WHERE PRICINGID = ?;', [pricingID]);
    const coachProductRow = await dbModule.dbGet('SELECT * FROM COACH_PRODUCT WHERE PRODUCTID = ?;', [pricingRow.STRIPEPRODUCTID]);
    const coachBankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?', [coachProductRow.COACHID]);

    const customerObject = await stripe.customers.retrieve(bankingRow.STRIPEID);
    if (!customerObject.default_source) {
      const paymentMethods = await stripe.customers.listPaymentMethods(bankingRow.STRIPEID, { type: 'card' });
      await stripe.customers.update(bankingRow.STRIPEID, {
        invoice_settings: { default_payment_method: paymentMethods.data[0].id }
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: bankingRow.STRIPEID,
      trial_period_days: 7,
      description: 'Monthly coaching through Bastion',
      application_fee_percent: 20,
      transfer_data: { destination: coachBankingRow.STRIPEID },
      items: [{ price: pricingRow.STRIPEPRICEID }]
    });
    resolve(subscription.id);
  });
};

exports.updateSubscriptionPrice = function updateSubscriptionPrice(pricingID, newPrice) {
  return new Promise(async function (resolve) {
    const SPricingsRow = await dbModule.dbGet('SELECT * FROM PRICINGS_STRIPE WHERE PRICINGID = ?;', [pricingID]);
    if (!SPricingsRow) {
      resolve(0);
      return;
    }
    const newPriceObject = await exports.createPrice(newPrice * 100, SPricingsRow.STRIPEPRODUCTID);
    await dbModule.dbRun('UPDATE PRICINGS_STRIPE SET STRIPEPRICEID = ? WHERE ID = ?;', [newPriceObject.id, SPricingsRow.ID]);
    resolve(1);
  });
};

exports.getBalance = function getBalance(userID) {
  return new Promise(async function (resolve) {
    if (!stripe) {
      resolve({ available: [{ amount: 0 }], pending: [{ amount: 0 }] });
      return;
    }
    const bankingRow = await dbModule.dbGet('SELECT * FROM BANKING WHERE USERID = ?;', [userID]);
    const balance = await stripe.balance.retrieve({
      stripeAccount: bankingRow.STRIPEID
    });
    resolve(balance);
  });
};
