package com.example.atsushiyamamoto.linish;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ListView;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class AddChatActivity extends AppCompatActivity {

    ListView list;
    Button button;
    List<String> friends;
    BaseAdapter adapter;
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_chat);
        context = getBaseContext();
        list = (ListView) findViewById(android.R.id.list);
        button = (Button) findViewById(R.id.startChatButton);

        setTitle("友だちを選択");
        showFriends();

        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {

            }
        });
    }

    protected void showFriends() {
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/friends", context, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                friends = makeResponseList(response);
                                AddChatActivity.this.runOnUiThread(new Runnable() {
                                    public void run() {
                                        adapter = new AddChatAdapter(context, friends, button);
                                        list.setAdapter(adapter);
                                        setStartChatButtonOnClickListener();
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

    protected void makeRoom(JsonArray users) {
        final Context context = getBaseContext();
        final JsonObject json = new JsonObject();
        final JsonArray membersJsonArray = users;
        json.add("member_ids", membersJsonArray);

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    postAsync("/rooms/create", json, context, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            AddChatActivity.this.runOnUiThread(new Runnable() {
                                public void run() {
                                    adapter = new AddChatAdapter(context, friends, button);
                                    list.setAdapter(adapter);

                                    ArrayList<String> membersArray = new ArrayList<String>();
                                    for (int i = 0, len = membersJsonArray.size(); i < len; i++) {
                                        membersArray.add(membersJsonArray.get(i).toString());
                                    }

                                    Intent intent = new Intent(context, MessageActivity.class);
                                    intent.setFlags(intent.FLAG_ACTIVITY_NEW_TASK);
                                    intent.putStringArrayListExtra("membersArray", membersArray);
                                    startActivity(intent);
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
    }

    protected void setStartChatButtonOnClickListener() {
        button.setOnClickListener(new View.OnClickListener() {
            CheckBox checkBox;
            @Override
            public void onClick(View view) {
                JsonArray users = new JsonArray();
                for (int i = 0, len = list.getChildCount(); i < len; i++) {
                    checkBox = (CheckBox)list.getChildAt(i).findViewById(R.id.chatCheckBox);
                    System.out.println(checkBox);
                    if(checkBox.isChecked()) {
                        String user = adapter.getItem(i).toString();
                        System.out.println(user);
                        users.add(user);
                    }
                }
                makeRoom(users);
            }
        });
    }
}
