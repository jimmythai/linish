package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.SearchView;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.JsonObject;

import org.w3c.dom.Text;

import java.io.IOException;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class AddFriendActivity extends AppCompatActivity {

    Button addFriendButton;
    SearchView searchFriend;
    TextView userIdText;
    TextView errorText;
    String searchQuery;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_friend);
        setTitle("ID検索");

        addFriendButton = (Button) findViewById(R.id.addFriendButton);
        searchFriend = (SearchView) findViewById(R.id.searchFriend);
        userIdText = (TextView) findViewById(R.id.userId);
        errorText = (TextView) findViewById(R.id.errorText);

        addFriendButton.setVisibility(View.GONE);
        userIdText.setVisibility(View.GONE);
        errorText.setVisibility(View.GONE);

        searchFriend.setOnQueryTextListener(new SearchView.OnQueryTextListener(){
            @Override
            public boolean onQueryTextChange(String newText){
                if (addFriendButton.getVisibility() == View.VISIBLE) {
                    addFriendButton.setVisibility(View.GONE);
                }
                if (userIdText.getVisibility() == View.VISIBLE) {
                    userIdText.setVisibility(View.GONE);
                }
                if (errorText.getVisibility() == View.VISIBLE) {
                    errorText.setVisibility(View.GONE);
                }
                return true;
            }

            @Override
            public boolean onQueryTextSubmit(String query){
                findFriend(query);
                searchQuery = query;
                return true;
            }
        });

        addFriendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                addFriendAction();
            }
        });
    }


    protected void findFriend(final String userId) {
        final Context context = getBaseContext();

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/accounts/" + userId, context, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                final Map user = makeResponseMap(response);
                                AddFriendActivity.this.runOnUiThread(new Runnable() {
                                    public void run() {
                                        if (user.containsKey("code")) {
                                            Double code = new Double(user.get("code").toString());
                                            System.out.println(code);
                                            if (Double.compare(code, 400.0) == 0) {
                                                errorText.setText(user.get("error").toString());
                                                errorText.setVisibility(View.VISIBLE);
                                            }
                                        } else {
                                            userIdText.setText(userId);
                                            userIdText.setVisibility(View.VISIBLE);
                                            addFriendButton.setVisibility(View.VISIBLE);
                                        }
                                    }
                                });
                            } catch (IOException e) {
                            }
                        }
                    });
                } catch(IOException e) {
                    e.printStackTrace();
                }

                return null;
            }
        }.execute();
    }

    protected void addFriendAction() {
        final Context context = getBaseContext();
        final JsonObject json = new JsonObject();
        json.addProperty("followed_id", searchQuery);

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    postAsync("/friends/add", json, AddFriendActivity.this, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                final Map resMap = makeResponseMap(response);
                                runOnUiThread(new Runnable() {
                                    public void run() {

                                        if (resMap.containsKey("code")) {
                                            Double code = new Double(resMap.get("code").toString());
                                            System.out.println(code);
                                            if (Double.compare(code, 400.0) == 0) {
                                                errorText.setText(resMap.get("error").toString());
                                                errorText.setVisibility(View.VISIBLE);
                                            }
                                        } else {
                                            finish();
                                        }
                                    }
                                });
                            } catch (IOException e) {
                            }
                        }
                    });
                } catch(IOException e) {
                    e.printStackTrace();
                }

                return null;
            }
        }.execute();
    }
}
