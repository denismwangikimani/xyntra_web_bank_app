"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

//destructure the .env variables
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

//we will create a getUserInfoProps interface that will hold the userId
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    //we will create an admin client and destructure the database from the client
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      //we will pass in the DATABASE_ID, USER_COLLECTION_ID, and a query that will equal the userId
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    //we will parse the user and return the first document in the user collection
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

//we will create a signIn function that will take in the email and password as parameters
export const signIn = async ({ email, password }: signInProps) => {
  try {
    //we will create an admin client and destructure the account from the client
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    //we will set the appwrite-session cookie
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    //we will create a user variable that will hold the response from the getLoggedInUser function
    const user = await getUserInfo({ userId: session.userId });

    //we will parse the user and return it
    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  //we will destruct the email, password, firstName, lastName from the userData object
  const { email, firstName, lastName } = userData;
  let newUserAccount;

  try {
    //mutate the database
    const { account, database } = await createAdminClient();

    //we will create a newUserAccount variable that will hold the response from the create function
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    //throw an error if the newUserAccount is null
    if (!newUserAccount) throw new Error("Error creating user");

    //we will create a user variable that will hold the response from the createDocument function
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    //throw an error if the dwollaCustomerUrl is null
    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    //we will create a dwollaCustomerId variable that will hold the response from the extractCustomerIdFromUrl function
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    //throw an error if the dwollaCustomerId is null
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    //we will create a session variable that will hold the response from the createEmailPasswordSession function
    const session = await account.createEmailPasswordSession(email, password);

    //we will set the appwrite-session cookie
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    //we parse the newUser thats coming from the database and return it
    return parseStringify(newUser);
  } catch (error) {
    console.error("Error:", error);
  }
};

// we will use this function to get the logged in user
export async function getLoggedInUser() {
  try {
    //we will create a session client and destructure the account from the client
    const { account } = await createSessionClient();
    //we will get the account
    const result = await account.get();

    //we will get the user info
    const user = await getUserInfo({ userId: result.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

// we will use this function to log out the user
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

//we will use this function to exchange the public token for a link token
export const createLinkToken = async (user: User) => {
  try {
    //we will create a tokenParams object that will hold the user, client_name, products, language, and country_codes
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth', 'transactions'] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    //we will create a response variable that will hold the response from the plaidClient.linkTokenCreate function, which will create a link token
    const response = await plaidClient.linkTokenCreate(tokenParams);
    //we will parse the response and return the linkToken
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

//we will use this function to create a bank account
//we will pass in the userId, bankId, accountId, accessToken, fundingSourceUrl, and shareableId as parameters
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    //we will create an admin client and destructure the database from the client
    const { database } = await createAdminClient();

    //we will create a bankAccount variable that will hold the response from the createDocument function
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    //we will parse the bankAccount and return it
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

//we will use this function to exchange the public token for an access token
//we will pass in the publicToken and user as parameters
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // Destructure the access token and item ID from the response
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Destructure the account data from the response
    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    // Create a processor token using the request
    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error, to make sure the fundingSourceUrl exists
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

//we will create a function that will get all thr banks form the user using the userId as a param
export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    //we will create an admin client and destructure the database from the client
    const { database } = await createAdminClient();

    //we will create a banks variable that will hold the response from the listDocuments function, which will list the documents in the bank collection
    const banks = await database.listDocuments(
      //we will pass in the DATABASE_ID, BANK_COLLECTION_ID, and a query that will equal the userId
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    //we will parse the banks and return the documents in the bank collection
    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

//we will create a function that will get a bank from the bank collection
//we will pass in the documentId as a parameter
export const getBank = async ({ documentId }: getBankProps) => {
  try {
    //we will create an admin client and destructure the database from the client
    const { database } = await createAdminClient();

    //we will create a bank variable that will hold the response from the listDocuments function, which will list the documents in the bank collection
    const bank = await database.listDocuments(
      //we will pass in the DATABASE_ID, BANK_COLLECTION_ID, and a query that will equal the documentId
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
    );

    //we will parse the bank and return the first document in the bank collection
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

//we will create a function that will get bankById from the bank collection
//we will pass in the coountId as a parameter
export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    //we will create an admin client and destructure the database from the client
    const { database } = await createAdminClient();

    //we will create a bank variable that will hold the response from the listDocuments function, which will list the documents in the bank collection
    const bank = await database.listDocuments(
      //we will pass in the DATABASE_ID, BANK_COLLECTION_ID, and a query that will equal the accountId
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    //we will return null if the bank total is not equal to 1
    if (bank.total !== 1) return null;

    //we will parse the bank and return the first document in the bank collection
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
