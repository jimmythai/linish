package com.example.atsushiyamamoto.linish;

/**
 * Created by atsushiyamamoto on 7/30/16.
 */

import java.io.IOException;
import java.lang.reflect.Array;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.util.ArrayMap;
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

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.hosopy.actioncable.ActionCable;
import com.hosopy.actioncable.ActionCableException;
import com.hosopy.actioncable.Channel;
import com.hosopy.actioncable.Consumer;
import com.hosopy.actioncable.Subscription;

import org.apache.commons.lang3.StringUtils;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;


public class MessageActivity extends AppCompatActivity {

    private EditText msg_edittext;
    private Random random;
    public static ArrayList<ChatMessage> chatlist;
    public static ChatAdapter chatAdapter;
    ListView msgListView;
    Integer selectedRoomId;
    Map<String, ArrayList<String>> messages;
    Map<String, String> user;
    Context context;
    Consumer consumer;

    @Override
    public void onCreate(Bundle  savedInstanceState) {
        super.onCreate(savedInstanceState);
        System.out.println("onCreate");
        setContentView(R.layout.activity_message);
        context = getBaseContext();

        Intent intent = getIntent();
        ArrayList<String> membersArray = intent.getStringArrayListExtra("membersArray");
        selectedRoomId = intent.getIntExtra("roomId", 0);

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

        try {
            URI uri = new URI("ws://127.0.0.1:3000/cable");
            this.consumer = ActionCable.createConsumer(uri);
            Channel                                                                                                                                                      appearanceChannel = new Channel("MessageChannel");
            Subscription subscription = consumer.getSubscriptions().create(appearanceChannel);

            subscription
            .onConnected(new Subscription.ConnectedCallback() {
                @Override
                public void call() {
                    System.out.print("YAY!");
                            // Called when the subscription has been successfully completed
                }
            }).onRejected(new Subscription.RejectedCallback() {
                @Override
                public void call() {
                    System.out.print("NO WAY!");
                    // Called when the subscription is rejected by the server
                }
            }).onReceived(new Subscription.ReceivedCallback() {
//                {users=[ayamam1129, ayamam1127], messages=[]}ROOMROOM
                @Override
                public void call(final JsonElement data) {
                    System.out.println("RECEIVED");
                    runOnUiThread(new Runnable() {
                                      @Override
                                      public void run() {
                                          JsonObject gsonData = data.getAsJsonObject();
                                          String messageBody = gsonData.get("message").getAsString();
                                          Integer roomId = gsonData.get("room_id").getAsInt();
                                          String userId = gsonData.get("user_id").getAsString();

                                          Map<String, Object> message = new HashMap<String, Object>();
                                          message.put("message", messageBody);
                                          message.put("room_id", roomId);
                                          message.put("user_id", userId);

                                          System.out.print("START");
                                          System.out.println(roomId.equals(selectedRoomId));
                                          System.out.println(roomId);
                                          System.out.println(selectedRoomId);

                                          if(roomId.equals(selectedRoomId)) {
                                              msg_edittext.setText("");
                                              chatAdapter.add(message);
                                              chatAdapter.notifyDataSetChanged();
                                          }

                                          System.out.print(data);
                                      }
                                  }
                    );
                    // Called when the subscription receives data from the server
                }
            }).onDisconnected(new Subscription.DisconnectedCallback() {
                @Override
                public void call() {
                    System.out.print("Bye");
                    // Called when the subscription has been closed
                }
            }).onFailed(new Subscription.FailedCallback() {
                @Override
                public void call(ActionCableException e) {
                    System.out.print("OH NO!");
                    // Called when the subscription encounters any error
                }
            });

            consumer.connect();

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        System.out.println("onStop");
        this.consumer.disconnect();
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
                    getAsync("/rooms/" + selectedRoomId +"/messages", context, new Callback() {
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
                        postAsync("/rooms/" + selectedRoomId + "/messages/add", json, MessageActivity.this, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                try {
                                    final Map resMap = makeResponseMap(response);
                                    runOnUiThread(new Runnable() {
                                        public void run() {

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
