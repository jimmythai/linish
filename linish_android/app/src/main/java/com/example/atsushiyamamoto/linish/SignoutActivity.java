package com.example.atsushiyamamoto.linish;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.BaseAdapter;
import android.widget.Button;

import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Response;

public class SignoutActivity extends AppCompatActivity {

    Button signoutButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signout);
        setTitle("ログアウト");

        signoutButton = (Button) findViewById(R.id.signoutButton);

        signoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signoutAction();
            }
        });
    }

    protected void signoutAction() {
        Context context = getBaseContext();
        final JsonObject json = new JsonObject();

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    postAsync("/accounts/signout", json, SignoutActivity.this, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            runOnUiThread(new Runnable() {
                                public void run() {
                                    Intent intent = new Intent(getApplicationContext(), SigninActivity.class);
                                    intent.setFlags(intent.FLAG_ACTIVITY_NEW_TASK | intent.FLAG_ACTIVITY_CLEAR_TASK);
                                    startActivity(intent);
                                }
                            });
                        }
                    });
                } catch (IOException e) {

                }
                return null;
            }
        }.execute();
    }
}
