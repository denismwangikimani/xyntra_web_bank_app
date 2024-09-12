"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async () => {
  try {
    //mutate the database
  } catch (error) {
    console.error("Error:", error);
  }
};

export const signUp = async ({ ...userData }: SignUpParams) => {
  //we will destruct the email, password, firstName, lastName from the userData object
  const { email, password, firstName, lastName } = userData;

  try {
    //mutate the database
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    //we parse the newUser
    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("Error:", error);
  }
};

// we will use this function to get the logged in user
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}
