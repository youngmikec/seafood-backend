
// export const USER_ROLE = {
//     OWNER:    1,
//     ADMIN:    2,
//     SUPPORT:  3,
//     USER:     4,
//   };
  
// export const USER_TYPE = {
// SENDER: "SENDER",
// DISPATCHER: "DISPATCHER",
// ADMIN: "ADMIN",
// };

// const appObj = {
//     USER_ROLE,
//     USER_TYPE,
// }

export const FREEXIT = {
  ADMIN: "5a51bc91860d8b5ba000a000",
  USERID: "5a51bc91860d8b5ba0001000",
  USERID2: "5a51bc91860d8b5ba0002000",
  WALLET_DEBIT: "1234ABCDEF",
  WALLET_CREDIT: "1000ABCDEF",
  WALLET_AMOUNT: 1_000_000_000_000,
  START_DATE: "2021-04-01",
};

export const TRANSACTION = {
  DEPOSIT: "D", // Crediting by Merchant or Customer
  WITHDRAW: "W", // Cashing out by Merchant or Customer
  TRANSFER: "T", // Spending within Ewallet System between Mechant and Cutsomer
};

export const PAYMENT = {
  GATEWAY: {
    PAYSTACK: "PAYSTACK",
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    GOOGLE_WALLET: "GOOGLE_WALLET",
    FREEXIT_WALLET: "FREEXIT_WALLET",
  },
  PAYMENT_METHOD: {
    CASH: "CASH",
    GATEWAY: "GATEWAY",
    TRANSFER: "TRANSFER",
    WALLET: "WALLET",
  },
  STATUS: {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
  },
};

export const PACKAGE = {
  STATUS: {
    PENDING: "PENDING",
    CHECKEDOUT: "CHECKEDOUT",
    PICKUP: "PICKUP",
    CANCELLED: "CANCELLED"
  }
}

export const DEPOSIT = {
  STATUS: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    DECLINED: 'DECLINED'
  },
  TRXNSTATUS: {
    FAILED: 'FAILED',
    SUCCESSFUL: 'SUCCESSFUL',
  }
}

export const WALLET = {
  STATUS: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED"
  }
}

export const EMAIL = {
  ADMIN: "freexittechnologies@gmail.com",
  SENDER: "sender@freexitnow.com",
  DISPATCHER: "dispatcher@freexitnow.com",
  CONTACT: "contact@freexitnow.com",
  NO_REPLY: "no-reply@freexitnow.com",
};

export const GENDER = {
  MALE: "M",
  FEMALE: "F",
  OTHER: "O",
};

export const COVERAGE = {
  GLOBAL:   1,
  COUNTRY:  2,
  REGION:   3,
};

export const USER_ROLE = {
  OWNER:    1,
  ADMIN:    2,
  SUPPORT:  3,
  USER:     4,
};

export const USER_TYPE = {
  SENDER: "SENDER",
  DISPATCHER: "DISPATCHER",
  ADMIN: "ADMIN",
};

export const SCHEDULE = {
  PENDING: 1,
  LOADING: 2,
  TRANSIT: 3,
};

export const ACCESS_LEVEL = {
  BLOCKED:    0,
  LOGIN:      1,
  READ:       2,
  CREATE:     3,
  UPDATE:     4,
  DELETE:     5,
  ASSIGNMENT: 6,
  SCHEDULE:   7,
  TRANSFER:   8,
  WITHDRAW:   9,
};

export const BUCKET = {
  PARCEL: "parcel",
  BLOG: "blog",
  PROFILE: "profile",
  VEHICLE: "vehicle",
  CATEGORY: "category",
};

export const DATABASE = {
  ERP_VERSION: 1,
  OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/,
  PRELOAD_TABLE_DATA: { TRUE: true, FALSE: false, DEFAULT: false },
  RECORD_STATUS: {
    REJECTED: 0,
    PENDING: 1,
    APPROVED: 2,
    AUDITED: 3,
    CLOSED: 4,
  },
  BASE_ID: {
    COUNTRY: "5c51bc91860d8bab00000001",
    REGION: "5c51bc91860d8bbc00000001",
  },
  OPTIONS: {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    autoIndex: true,
    minimize: false,
    versionKey: false,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line object-shorthand
      transform: function (doc, ret) {
        ret.id = ret._id;
        // ret.createdAt = ret.created_at;
        // ret.updatedAt = ret.updated_at;
        delete ret._id;
        delete ret.updated_at;
        delete ret.created_at;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  },
};

export const ENTITY = {
  ASSIGNMENT:    "Assignment",
  BANK:          "Bank",
  CATEGORY:      "Category",
  COUNTRY:       "Country",
  DEPOSIT:       "Deposit",
  LIEN:          "Lien",
  MAIL:          "Mail",
  MEDIA:         "Media",
  NOTIFICATION:  "Notification",
  OTP:           "Otp",
  PARCEL:        "Parcel",
  RATING:        "Rating",
  REGION:        "Region",
  REPORT:        "Report",
  SCHEDULE:      "Schedule",
  SETTING:       "Setting",
  SMS:           "Sms",
  TERMINAL:      "Terminal",
  TICKET:        "Ticket",
  TRACK:         "Track",
  TRANSACTION:   "Transaction",
  TRANSFER:      "Transfer",
  UPGRADE:       "Upgrade",
  USER:          "User",
  VEHICLE:      "Vehicle",
  WITHDRAW:      "Withdraw",
};
export const JWT = {
  saltRounds: 2,
  jwtSecret: "miliscot_its-a-bae`s-a_dragonEGG-secret",
  tokenExpireTime: "72h",
};

export const SMS = {
  FREEXIT_SMS_SENDER: "+1323649 6765",
};

export const API = {
  URL: "https://freexitnow.com",
};

export const INPUT_TYPE = {
  TEXT: "TEXT",
  TEXTAREA: "TEXTAREA",
  DROPDOWN: "DROPDOWN",
  FILE: "FILE",
  DATETIME: "DATETIME",
  LOCATION: "LOCATION",
  SELECTLIST: "SELECTLIST",
  RADIOBUTTON: "RADIOBUTTON",
  CHECKBOXES: "CHECKBOXES",
  DATE: "DATE",
  TIME: "TIME",
  NUMBER: "NUMBER",
};

export const TICKET_PRIORITY = {
  EMERGENCY: 4,
  HIGH:      3,
  NORMAL:    2,
  LOW:       1,
};

export const ASSIGNMENT = {
  STATUS: {
    CANCELLED:  0,
    PENDING:    1,
    ASSIGNED:   2,
    ACCEPTED:   3,
    COLLECTED:  4,
    DECLINED:   5,
    DISPATCHED: 6,
    DELIVERED:  7,
    CONFIRMED:  8,
    EXPIRED:    9,
  },
  TYPE: {
    SYSTEM:      1,
    ADMIN:       2,
    SENDER:      3,
    DISPATCHER:  4,
  },
};

export const PARCEL = {
  STATUS: {
    CANCELLED:   0,
    PENDING:     1,
    PACKAGED:    2,
    PAID:        3,
    ASSIGNED:    4,
    // CHECKOUT:    2,
    // CHARGED:     3,
    // ASSIGNED:    4,
    // ACCEPTED:    5,
    // COLLECTED:   6,
    SHIPPED:  5,
    ARRIVED:  6,
    DELIVERED:   7,
    CONFIRMED:   8,
  },
  FRAGILITY: { ROBUST: "ROBUST", FRAGILE: "FRAGILE" },
  PERISHABILITY: { NONPERISHABLE: "NONPERISHABLE", PERISHABLE: "PERISHABLE" },
  COMBUSTIBILITY: {
    NONCOMBUSTIBLE: "NONCOMBUSTIBLE",
    COMBUSTIBLE: "COMBUSTIBLE",
  },
  ODIFEROUSNESS: { ODOROUS: "ODOROUS", ODORLESS: "ODORLESS" },
  SOLIDITY: { SOLID: "SOLID", LIQUID: "LIQUID" },
  UNIQUENESS: { ORDINARY: "ORDINARY", EXTRAORDINARY: "EXTRAORDINARY" },
  MAX_MASS:      9_000_000,
  MAX_VOLUME:    9_000_000,
  MAX_DISTANCE:  50_000,
  MAX_WORTH:     9_000_000,
  MAX_CHARGE:    9_000_000_000,
  MIN_CHARGE:    1_000,
};

export const VEHICLE = {
  TYPE: {
    BUS:      "BUS",
    CAR:      "CAR",
    TAXI:     "TAXI",
    KEKE:     "KEKE",
    BIKE:     "BIKE",
    JEEP:     "JEEP",
    TRUCK:    "TRUCK",
    TRAILER:  "TRAILER",
    AIRCRAFT: "AIRCRAFT",
    SHIP:     "SHIP",
    BOAT:     "BOAT",
  },
  MAKE: {
    TOYOTA:  "TOYOTA",
    UGAMA:   "UGAMA",
    MEIYER:  "MEIYER",
    SIENNA:  "SIENNA",
    KINGO:   "KINGO",
  },
};

export * from "./env-constant.js";
