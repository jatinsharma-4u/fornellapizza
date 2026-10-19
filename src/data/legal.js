// Policy content for the demo storefront. Anything in [SQUARE BRACKETS] is a placeholder the
// business must replace with its real details before going live. This is not legal advice.

export const policyMeta = {
  updated: '[EFFECTIVE DATE]',
  business: '[LEGAL BUSINESS NAME]',
  address: '[REGISTERED BUSINESS ADDRESS]',
  email: '[SUPPORT EMAIL]',
  phone: '[SUPPORT PHONE]',
}

const B = policyMeta

export const policies = {
  privacy: {
    title: 'Privacy Policy',
    intro: `This Privacy Policy explains how ${B.business} (“we”, “us”) collects, uses and protects personal information when you use this website to browse the menu, create an account, place orders or book a table.`,
    sections: [
      ['Information we collect', [
        'Account details you provide: name, email address, phone number and password (stored in a hashed form by our authentication provider).',
        'Order information: items ordered, customisations, delivery or pickup address, delivery instructions, order history and order totals.',
        'Payment information: payments are handled by [PAYMENT PROVIDER]. We do not store full card numbers; we may receive a payment token, card brand and the last four digits.',
        'Communications: messages you send us through the contact form, email or phone.',
        'Technical data: device type, browser, IP address and pages visited, collected through cookies and similar technologies (see “Cookies”).',
      ]],
      ['How we use your information', [
        'To prepare, deliver and support your orders, including sending order confirmations and status updates.',
        'To create and manage your account, saved addresses and loyalty points.',
        'To respond to questions, complaints and refund requests.',
        'To send marketing emails or messages only where you have opted in. You can unsubscribe at any time.',
        'To keep the service secure, prevent fraud and comply with legal obligations.',
      ]],
      ['Sharing your information', [
        'With delivery partners or our own riders, limited to what is needed to deliver your order (name, phone number, address, instructions).',
        'With service providers that host the website, process payments or send emails on our behalf, under contracts that protect your data.',
        'With authorities where required by law. We never sell your personal information.',
      ]],
      ['Cookies', [
        'Essential cookies and local storage keep your bag, sign-in and preferences working. These cannot be switched off.',
        'Optional analytics cookies help us understand how the site is used. These are only set with your consent and can be withdrawn at any time.',
      ]],
      ['Data retention', [
        'Account data is kept while your account is active. Order records are kept for [RETENTION PERIOD] for accounting and legal purposes.',
        'You can delete your account at any time from Account → Settings & privacy.',
      ]],
      ['Your rights', [
        'Depending on where you live, you may have the right to access, correct, delete or export your data, and to object to certain processing.',
        `To make a request, contact us at ${B.email}. We will respond within [RESPONSE TIMEFRAME].`,
      ]],
      ['Contact', [`${B.business}, ${B.address}. Email: ${B.email}. Phone: ${B.phone}.`]],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: `These terms govern your use of this website and any order you place with ${B.business}. By placing an order you agree to them.`,
    sections: [
      ['Using the website', [
        'You must provide accurate information when creating an account or placing an order, and keep your password secure.',
        'You must not misuse the site, attempt to access it without authorisation or interfere with its operation.',
      ]],
      ['Orders', [
        'An order is a request to purchase. It is accepted when we send an order confirmation.',
        'We may decline or cancel an order if an item is unavailable, the address is outside our delivery area, or we suspect fraud. You will not be charged for orders we cancel.',
        'Menu items are prepared in a kitchen that handles common allergens. Please read allergen information and contact us before ordering if you have an allergy.',
      ]],
      ['Prices & payment', [
        'Prices are shown in [CURRENCY] and include/exclude [APPLICABLE TAXES]. Delivery fees, discounts and taxes are shown before you confirm.',
        'Promo codes are subject to their own conditions, cannot be exchanged for cash and only one code applies per order unless stated.',
        'Payment is taken via [PAYMENT PROVIDER] or in cash on delivery where offered.',
      ]],
      ['Loyalty programme', [
        'Fornella Club points are earned on eligible spend, have no cash value and may be changed or withdrawn with reasonable notice.',
      ]],
      ['Liability', [
        `Nothing in these terms limits liability that cannot be limited by law. Otherwise, ${B.business}’s liability for any order is limited to the price paid for that order.`,
      ]],
      ['Changes & governing law', [
        'We may update these terms; the version on the site at the time of your order applies.',
        'These terms are governed by the laws of [JURISDICTION].',
      ]],
    ],
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    intro: 'We want every order to be right. Here is how cancellations and refunds work.',
    sections: [
      ['Cancelling an order', [
        'You can cancel free of charge within 2 minutes of placing an order, from the order tracking page, while it is still in “Order placed” or “Confirmed”.',
        'After preparation has started we may not be able to cancel, because your food is made fresh to order. Contact us and we will do our best.',
        'Scheduled orders can be cancelled free of charge up to [CUTOFF TIME] before the scheduled time.',
      ]],
      ['When you are eligible for a refund', [
        'Items missing from your order, or the wrong item delivered.',
        'Food that arrives damaged, spilled or not prepared as described.',
        'Orders that are significantly late or never arrive, where the delay was within our control.',
      ]],
      ['How to request a refund', [
        `Contact us within [CLAIM WINDOW, e.g. 24 hours] of delivery via the Help Centre, ${B.email} or ${B.phone}, with your order number and, where possible, a photo.`,
        'We review requests within [REVIEW TIMEFRAME] and may offer a replacement, store credit or a refund to the original payment method.',
      ]],
      ['Refund timing', [
        'Card and wallet refunds are issued to the original payment method and typically appear within [5–10] business days, depending on your bank.',
        'Cash orders are refunded as store credit or by [ALTERNATIVE METHOD].',
      ]],
      ['Non-refundable situations', [
        'Change of mind after the order has been prepared.',
        'Incorrect address or contact details provided at checkout, or no one available to receive the order.',
      ]],
    ],
  },
  delivery: {
    title: 'Delivery Policy',
    intro: 'Everything you need to know about how and where we deliver.',
    sections: [
      ['Delivery area & hours', [
        'We deliver within [DELIVERY RADIUS / AREAS] of each location during opening hours. Enter your address at checkout to confirm availability.',
        'Last orders for delivery are taken [X] minutes before closing.',
      ]],
      ['Delivery times', [
        'Most orders arrive in 25–35 minutes. Estimated times are shown at checkout and on the tracking page and may change at busy times or in bad weather.',
        'Scheduled orders can be booked in 30-minute slots up to [X] days ahead.',
      ]],
      ['Fees & minimums', [
        'Delivery is free on orders over $25 (after discounts). Below that, a delivery fee of $2.99 applies. [CONFIRM ACTUAL FEES]',
        'A minimum order value of [MINIMUM] may apply in some areas.',
      ]],
      ['Receiving your order', [
        'Please make sure your address, buzzer details and phone number are correct. Our rider will call if they cannot find you.',
        'Contactless delivery is available — add a note at checkout or enable it in your account settings.',
        'If no one is available, the rider will wait up to [WAIT TIME] minutes before the order is returned. Such orders may not be refundable.',
      ]],
      ['Pickup', [
        'Choose “Pickup” at checkout. Orders are usually ready in about 15 minutes; please bring your order number.',
      ]],
      ['Food safety', [
        'Hot food is packed in insulated bags. Please consume promptly and refrigerate leftovers within 2 hours.',
      ]],
    ],
  },
}

export const helpTopics = [
  { id: 'orders', title: 'Orders & tracking', body: 'Track an active order, view receipts and reorder past meals.', to: '/orders' },
  { id: 'delivery', title: 'Delivery', body: 'Areas, timings, fees and what to do if your rider can’t find you.', to: '/delivery-policy' },
  { id: 'refunds', title: 'Refunds & cancellations', body: 'Cancel within 2 minutes, report missing or incorrect items.', to: '/refund-policy' },
  { id: 'account', title: 'Account & points', body: 'Update your details, addresses and Fornella Club points.', to: '/profile' },
  { id: 'payments', title: 'Payments & promo codes', body: 'Accepted payment methods and how discount codes work.', to: '/terms' },
  { id: 'kitchen', title: 'Kitchen status', body: 'Is the kitchen busy or closed? See live wait times here.', to: '/kitchen-status' },
  { id: 'privacy', title: 'Privacy & data', body: 'How we use your data and how to delete your account.', to: '/privacy' },
]
