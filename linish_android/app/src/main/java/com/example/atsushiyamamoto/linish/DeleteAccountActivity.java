package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.google.gson.JsonObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Response;

public class DeleteAccountActivity extends AppCompatActivity {

    Button deleteButton;
    Button cancelButton;
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete_account);
        setTitle("退会");

        deleteButton = (Button) findViewById(R.id.deleteButton);
        cancelButton = (Button) findViewById(R.id.cancelButton);
        context = getBaseContext();

        deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                deleteAccountAction();
            }
        });

        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    protected void deleteAccountAction() {
        final JsonObject json = new JsonObject();

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    postAsync("/accounts/delete", json, DeleteAccountActivity.this, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            runOnUiThread(new Runnable() {
                                public void run() {
                                    Intent intent = new Intent(getApplicationContext(), SignupActivity.class);
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

    protected void cancelAction() {
        finish();
    }
}
