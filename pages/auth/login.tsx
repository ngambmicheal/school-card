import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Theme } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import useSchool from "../../hooks/useSchool";
import { helperService } from "../../services";

export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";
export interface SignInServerPageParams {
  csrfToken: string;
  callbackUrl: string;
  email: string;
  error: SignInErrorTypes;
  theme: Theme;
}

export default function SignIn({ csrfToken }: any) {
  const router = useRouter();
  const errors: Record<SignInErrorTypes, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in.",
  };

  const { error: errorType } = router.query as { error: SignInErrorTypes };

  const error = errorType && (errors[errorType] ?? errors.default);

  const schoolId = helperService.getSchoolId();

  return (
    <>
      <div className="row">
        <div className="col-sm-6 m-auto">
          <div className="card">
            <div className="card-body">
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {schoolId && (
                <form method="post" action="/api/auth/callback/credentials">
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <input
                    name="schoolId"
                    type="hidden"
                    defaultValue={schoolId}
                  />
                  <div className="form-group">
                    <label> Username </label>
                    <input
                      className="form-control"
                      name="username"
                      type="text"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                    />
                  </div>

                  <button className="btn btn-dark" type="submit">
                    Sign in
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
