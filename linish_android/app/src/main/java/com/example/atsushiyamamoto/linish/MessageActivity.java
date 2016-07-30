package com.example.atsushiyamamoto.linish;

/**
 * Created by atsushiyamamoto on 7/30/16.
 */

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;

import com.google.gson.JsonObject;

import org.apache.commons.lang3.StringUtils;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;


public class MessageActivity extends AppCompatActivity {

    private EditText msg_edittext;
    private String user1 = "khushi", user2 = "khushi1";
    private Random random;
    public static ArrayList<ChatMessage> chatlist;
    public static ChatAdapter chatAdapter;
    ListView msgListView;
    Integer roomId;
    Map<String, ArrayList<String>> messages;
    Map<String, String> user;
    Context context;

    @Override
    public void onCreate(Bundle  savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_message);
        context = getBaseContext();

        Intent intent = getIntent();
        ArrayList<String> membersArray = intent.getStringArrayListExtra("membersArray");
        roomId = intent.getIntExtra("roomId", 0);

        if (membersArray != null) {
            String separator = ", ";
            String members = StringUtils.join(membersArray, separator).replaceAll("\"", "");
            setTitle(members);
        }

        getUser();

        random = new Random();
        msg_edittext = (EditText) findViewById(R.id.messageEditText);
        msgListView = (ListView) findViewById(R.id.msgListView);
        Button sendButton = (Button) findViewById(R.id.sendMessageButton);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (v.getId()) {
                    case R.id.sendMessageButton:
                        sendTextMessage(v);
                        break;
                }
            }
        });

        // ----Set autoscroll of listview when a new message arrives----//
        msgListView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
        msgListView.setStackFromBottom(true);

        getTextMessage();

//        Map<String, ArrayList<Object>> messages = new HashMap<String, ArrayList<Object>>();
//        chatAdapter = new ChatAdapter(MessageActivity.this, messages);
//        msgListView.setAdapter(chatAdapter);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
    }

    public void getUser() {
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    user = get("/accounts", context);
                } catch(IOException e) {
                    e.printStackTrace();
                }

                return null;
            }
        }.execute();
    }

    public void getTextMessage() {
        final Context context = getBaseContext();
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/rooms/" + roomId +"/messages", context, new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                messages = makeResponseMap(response);
                                MessageActivity.this.runOnUiThread(new Runnable() {
                                    public void run() {
                                        chatAdapter = new ChatAdapter(MessageActivity.this, messages, user);
                                        msgListView.setAdapter(chatAdapter);
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

    public void sendTextMessage(View v) {
        final String message = msg_edittext.getEditableText().toString();
        final String userId = user.get("user_id").toString();


        if (!message.equalsIgnoreCase("")) {
//            final Map chatMessage = new HashMap() {
//                {
//                    put("user_id", userId);
//                    put("message", message);
//                }
//            };

            final Context context = getBaseContext();
            final JsonObject json = new JsonObject();
            json.addProperty("message", msg_edittext.getEditableText().toString());
//            json.addProperty("user_id", user.get("user_id").toString());

            new API() {
                @Override
                protected String doInBackground(Void... params) {
                    try {
                        postAsync("/rooms/" + roomId + "/messages/add", json, MessageActivity.this, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                try {
                                    final Map resMap = makeResponseMap(response);
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            System.out.println(resMap);
                                            msg_edittext.setText("");
                                            chatAdapter.add(resMap);
                                            chatAdapter.notifyDataSetChanged();
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

    protected void sendMessageToServer() {

    }

}
