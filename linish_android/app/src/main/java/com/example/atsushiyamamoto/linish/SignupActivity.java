package com.example.atsushiyamamoto.linish;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;

import android.widget.Button;

import android.view.View;
import android.widget.TextView;
import java.util.*;
import java.util.regex.*;
import org.apache.commons.lang3.StringUtils;
import java.lang.*;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Response;

import android.content.Intent;

import com.google.gson.JsonObject;

public class SignupActivity extends AppCompatActivity {
    EditText idTextField;
    EditText emailTextField;
    EditText passwordTextField;
    TextView linkText;
    Button signUpButton;
    Map resMap = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        setTitle("新規登録");

        idTextField = (EditText) findViewById(R.id.signupId);
        emailTextField = (EditText) findViewById(R.id.signupEmail);
        passwordTextField = (EditText) findViewById(R.id.signupPassword);
        signUpButton = (Button) findViewById(R.id.signupButton);
        linkText = (TextView) findViewById(R.id.signinLink);

        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                List<String> errors = new ArrayList<String>();
                String userId = idTextField.getText().toString();
                String email = emailTextField.getText().toString();
                String password = passwordTextField.getText().toString();
                String uuid = UUID.randomUUID().toString();
//                Pattern pattern = Pattern.compile("^[\\w+\\-.]+@[a-z\\d\\-.]+\\.[a-z]+$");
                String regex = "^[\\w+\\-.]+@[a-z\\d\\-.]+\\.[a-z]+$";

                if (StringUtils.isBlank(email)) {
                    errors.add("メールアドレスを入力してください");
                } else if (!email.matches(regex)) {
                    errors.add("正しいメールアドレスを入力してください");
                }

                if (StringUtils.isBlank(userId)) {
                    errors.add("IDを入力してください");
                } else if (userId.length() >= 25) {
                    errors.add("ユーザーIDは25文字以内で入力してください");
                }

                if (StringUtils.isBlank(password)) {
                    errors.add("パスワードを入力してください");
                } else if (password.length() < 8 || password.length() >= 100) {
                    errors.add("パスワードは8文字以上100文字以内で入力してください");
                }

                if (errors.isEmpty()) {
                    final JsonObject json = new JsonObject();
                    json.addProperty("user_id", userId);
                    json.addProperty("email", email);
                    json.addProperty("password", password);

                    new API() {
                        @Override
                        protected String doInBackground(Void... params) {
                            try {
//                                resMap = post("/accounts/signup", formBody, SignupActivity.this);
                                postAsync("/accounts/signup", json, SignupActivity.this, new Callback() {
                                    @Override
                                    public void onFailure(Call call, IOException e) {

                                    }

                                    @Override
                                    public void onResponse(Call call, Response response) throws IOException {
                                        final Map resMap = makeResponseMap(response);
                                        runOnUiThread(new Runnable() {
                                            public void run() {
                                                if(resMap.containsKey("code")) {
                                                    Double code = new Double(resMap.get("code").toString());
                                                    if (Double.compare(code, 400.0) == 0) {
                                                        AlertDialog.Builder alertDlg = new AlertDialog.Builder(SignupActivity.this);
                                                        alertDlg.setTitle("Duplicate account");
                                                        alertDlg.setMessage("入力したユーザー名またはメールアドレスはすでに登録されています");
                                                        alertDlg.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                                            public void onClick(DialogInterface dialog, int which) {
                                                            }
                                                        });
                                                        alertDlg.create().show();
                                                    }
                                                } else {
                                                    System.out.println(getApplicationContext());
                                                    Intent intent = new Intent(getApplicationContext(), MainTabActivity.class);
                                                    intent.setFlags(intent.FLAG_ACTIVITY_NEW_TASK | intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                    startActivity(intent);
                                                }
                                            }
                                        });
                                    }
                                });
                            } catch(IOException e) {
                                e.printStackTrace();
                            }
                            return null;
                        }
                    }.execute();

                } else {
                    String separater = "\n";
                    String error = StringUtils.join(errors, separater);
                    AlertDialog.Builder alertDlg = new AlertDialog.Builder(SignupActivity.this);
                    alertDlg.setTitle("Signup Error");
                    alertDlg.setMessage(error);
                    alertDlg.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                        }
                    });
                    alertDlg.create().show();
                }
            }
        });

        linkText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), SigninActivity.class);
                startActivity(intent);
            }
        });
    }
}




//package com.example.atsushiyamamoto.linish;
//
//import android.animation.Animator;
//import android.animation.AnimatorListenerAdapter;
//import android.annotation.TargetApi;
//import android.content.pm.PackageManager;
//import android.support.annotation.NonNull;
//import android.support.design.widget.Snackbar;
//import android.support.v7.app.AppCompatActivity;
//import android.app.LoaderManager.LoaderCallbacks;
//
//import android.content.CursorLoader;
//import android.content.Loader;
//import android.database.Cursor;
//import android.net.Uri;
//import android.os.AsyncTask;
//
//import android.os.Build;
//import android.os.Bundle;
//import android.provider.ContactsContract;
//import android.text.TextUtils;
//import android.view.KeyEvent;
//import android.view.View;
//import android.view.View.OnClickListener;
//import android.view.inputmethod.EditorInfo;
//import android.widget.ArrayAdapter;
//import android.widget.AutoCompleteTextView;
//import android.widget.Button;
//import android.widget.EditText;
//import android.widget.TextView;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static android.Manifest.permission.READ_CONTACTS;

/**
 * A login screen that offers login via email/password.
 */
//public class SignupActivity extends AppCompatActivity {
//
//}
//public class SignupActivity extends AppCompatActivity implements LoaderCallbacks<Cursor> {
//
//    /**
//     * Id to identity READ_CONTACTS permission request.
//     */
//    private static final int REQUEST_READ_CONTACTS = 0;
//
//    /**
//     * A dummy authentication store containing known user names and passwords.
//     * TODO: remove after connecting to a real authentication system.
//     */
//    private static final String[] DUMMY_CREDENTIALS = new String[]{
//            "foo@example.com:hello", "bar@example.com:world"
//    };
//    /**
//     * Keep track of the login task to ensure we can cancel it if requested.
//     */
//    private UserLoginTask mAuthTask = null;
//
//    // UI references.
//    private AutoCompleteTextView mEmailView;
//    private EditText mPasswordView;
//    private View mProgressView;
//    private View mLoginFormView;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_signup);
//        // Set up the login form.
//        mEmailView = (AutoCompleteTextView) findViewById(R.id.signupEmail);
//        populateAutoComplete();
//
//        mPasswordView = (EditText) findViewById(R.id.signinPassword);
//        mPasswordView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
//            @Override
//            public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
//                if (id == R.id.login || id == EditorInfo.IME_NULL) {
//                    attemptLogin();
//                    return true;
//                }
//                return false;
//            }
//        });
//
//        Button mEmailSignInButton = (Button) findViewById(R.id.signinButton);
//        mEmailSignInButton.setOnClickListener(new OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                attemptLogin();
//            }
//        });
//
//        mLoginFormView = findViewById(R.id.signinForm);
//        mProgressView = findViewById(R.id.login_progress);
//    }
//
//    private void populateAutoComplete() {
//        if (!mayRequestContacts()) {
//            return;
//        }
//
//        getLoaderManager().initLoader(0, null, this);
//    }
//
//    private boolean mayRequestContacts() {
//        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
//            return true;
//        }
//        if (checkSelfPermission(READ_CONTACTS) == PackageManager.PERMISSION_GRANTED) {
//            return true;
//        }
//        if (shouldShowRequestPermissionRationale(READ_CONTACTS)) {
//            Snackbar.make(mEmailView, R.string.permission_rationale, Snackbar.LENGTH_INDEFINITE)
//                    .setAction(android.R.string.ok, new View.OnClickListener() {
//                        @Override
//                        @TargetApi(Build.VERSION_CODES.M)
//                        public void onClick(View v) {
//                            requestPermissions(new String[]{READ_CONTACTS}, REQUEST_READ_CONTACTS);
//                        }
//                    });
//        } else {
//            requestPermissions(new String[]{READ_CONTACTS}, REQUEST_READ_CONTACTS);
//        }
//        return false;
//    }
//
//    /**
//     * Callback received when a permissions request has been completed.
//     */
//    @Override
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
//                                           @NonNull int[] grantResults) {
//        if (requestCode == REQUEST_READ_CONTACTS) {
//            if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                populateAutoComplete();
//            }
//        }
//    }
//
//
//    /**
//     * Attempts to sign in or register the account specified by the login form.
//     * If there are form errors (invalid email, missing fields, etc.), the
//     * errors are presented and no actual login attempt is made.
//     */
//    private void attemptLogin() {
//        if (mAuthTask != null) {
//            return;
//        }
//
//        // Reset errors.
//        mEmailView.setError(null);
//        mPasswordView.setError(null);
//
//        // Store values at the time of the login attempt.
//        String email = mEmailView.getText().toString();
//        String password = mPasswordView.getText().toString();
//
//        boolean cancel = false;
//        View focusView = null;
//
//        // Check for a valid password, if the user entered one.
//        if (!TextUtils.isEmpty(password) && !isPasswordValid(password)) {
//            mPasswordView.setError(getString(R.string.error_invalid_password));
//            focusView = mPasswordView;
//            cancel = true;
//        }
//
//        // Check for a valid email address.
//        if (TextUtils.isEmpty(email)) {
//            mEmailView.setError(getString(R.string.error_field_required));
//            focusView = mEmailView;
//            cancel = true;
//        } else if (!isEmailValid(email)) {
//            mEmailView.setError(getString(R.string.error_invalid_email));
//            focusView = mEmailView;
//            cancel = true;
//        }
//
//        if (cancel) {
//            // There was an error; don't attempt login and focus the first
//            // form field with an error.
//            focusView.requestFocus();
//        } else {
//            // Show a progress spinner, and kick off a background task to
//            // perform the user login attempt.
//            showProgress(true);
//            mAuthTask = new UserLoginTask(email, password);
//            mAuthTask.execute((Void) null);
//        }
//    }
//
//    private boolean isEmailValid(String email) {
//        //TODO: Replace this with your own logic
//        return email.contains("@");
//    }
//
//    private boolean isPasswordValid(String password) {
//        //TODO: Replace this with your own logic
//        return password.length() > 4;
//    }
//
//    /**
//     * Shows the progress UI and hides the login form.
//     */
//    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
//    private void showProgress(final boolean show) {
//        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
//        // for very easy animations. If available, use these APIs to fade-in
//        // the progress spinner.
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
//            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);
//
//            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
//            mLoginFormView.animate().setDuration(shortAnimTime).alpha(
//                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
//                @Override
//                public void onAnimationEnd(Animator animation) {
//                    mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
//                }
//            });
//
//            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
//            mProgressView.animate().setDuration(shortAnimTime).alpha(
//                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
//                @Override
//                public void onAnimationEnd(Animator animation) {
//                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
//                }
//            });
//        } else {
//            // The ViewPropertyAnimator APIs are not available, so simply show
//            // and hide the relevant UI components.
//            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
//            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
//        }
//    }
//
//    @Override
//    public Loader<Cursor> onCreateLoader(int i, Bundle bundle) {
//        return new CursorLoader(this,
//                // Retrieve data rows for the device user's 'profile' contact.
//                Uri.withAppendedPath(ContactsContract.Profile.CONTENT_URI,
//                        ContactsContract.Contacts.Data.CONTENT_DIRECTORY), ProfileQuery.PROJECTION,
//
//                // Select only email addresses.
//                ContactsContract.Contacts.Data.MIMETYPE +
//                        " = ?", new String[]{ContactsContract.CommonDataKinds.Email
//                .CONTENT_ITEM_TYPE},
//
//                // Show primary email addresses first. Note that there won't be
//                // a primary email address if the user hasn't specified one.
//                ContactsContract.Contacts.Data.IS_PRIMARY + " DESC");
//    }
//
//    @Override
//    public void onLoadFinished(Loader<Cursor> cursorLoader, Cursor cursor) {
//        List<String> emails = new ArrayList<>();
//        cursor.moveToFirst();
//        while (!cursor.isAfterLast()) {
//            emails.add(cursor.getString(ProfileQuery.ADDRESS));
//            cursor.moveToNext();
//        }
//
//        addEmailsToAutoComplete(emails);
//    }
//
//    @Override
//    public void onLoaderReset(Loader<Cursor> cursorLoader) {
//
//    }
//
//    private void addEmailsToAutoComplete(List<String> emailAddressCollection) {
//        //Create adapter to tell the AutoCompleteTextView what to show in its dropdown list.
//        ArrayAdapter<String> adapter =
//                new ArrayAdapter<>(SignupActivity.this,
//                        android.R.layout.simple_dropdown_item_1line, emailAddressCollection);
//
//        mEmailView.setAdapter(adapter);
//    }
//
//
//    private interface ProfileQuery {
//        String[] PROJECTION = {
//                ContactsContract.CommonDataKinds.Email.ADDRESS,
//                ContactsContract.CommonDataKinds.Email.IS_PRIMARY,
//        };
//
//        int ADDRESS = 0;
//        int IS_PRIMARY = 1;
//    }
//
//    /**
//     * Represents an asynchronous login/registration task used to authenticate
//     * the user.
//     */
//    public class UserLoginTask extends AsyncTask<Void, Void, Boolean> {
//
//        private final String mEmail;
//        private final String mPassword;
//
//        UserLoginTask(String email, String password) {
//            mEmail = email;
//            mPassword = password;
//        }
//
//        @Override
//        protected Boolean doInBackground(Void... params) {
//            // TODO: attempt authentication against a network service.
//
//            try {
//                // Simulate network access.
//                Thread.sleep(2000);
//            } catch (InterruptedException e) {
//                return false;
//            }
//
//            for (String credential : DUMMY_CREDENTIALS) {
//                String[] pieces = credential.split(":");
//                if (pieces[0].equals(mEmail)) {
//                    // Account exists, return true if the password matches.
//                    return pieces[1].equals(mPassword);
//                }
//            }
//
//            // TODO: register the new account here.
//            return true;
//        }
//
//        @Override
//        protected void onPostExecute(final Boolean success) {
//            mAuthTask = null;
//            showProgress(false);
//
//            if (success) {
//                finish();
//            } else {
//                mPasswordView.setError(getString(R.string.error_incorrect_password));
//                mPasswordView.requestFocus();
//            }
//        }
//
//        @Override
//        protected void onCancelled() {
//            mAuthTask = null;
//            showProgress(false);
//        }
//    }
//}

