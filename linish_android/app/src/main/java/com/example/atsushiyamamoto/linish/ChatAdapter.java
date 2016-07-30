package com.example.atsushiyamamoto.linish;

/**
 * Created by atsushiyamamoto on 7/30/16.
 */

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class ChatAdapter extends BaseAdapter {

    private static LayoutInflater inflater = null;
    ArrayList<String> users;
    ArrayList<Map> messages;
    String senderId;
    String messageId;
    String userId;
    Map<String, String> user;
    Context context;


    public ChatAdapter(Activity activity, Map<String, ArrayList<String>> room, Map<String, String> user) {
        context = (Context) activity;
        System.out.println(room + "ROOMROOM");
        this.user = user;
        users = (ArrayList) room.get("users");
        messages = (ArrayList) room.get("messages");
        userId = new API().getAccessToken(context);

        inflater = (LayoutInflater) activity
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

    }

    @Override
    public int getCount() {
        return messages.size();
    }

    @Override
    public Object getItem(int position) {
        return position;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Map<String, Object> message = (Map<String, Object>) messages.get(position);
        View vi = convertView;
        if (convertView == null)
            vi = inflater.inflate(R.layout.chatbubble, null);

        TextView msg = (TextView) vi.findViewById(R.id.message_text);
        msg.setText((String) message.get("message"));
        LinearLayout layout = (LinearLayout) vi
                .findViewById(R.id.bubble_layout);
        LinearLayout parent_layout = (LinearLayout) vi
                .findViewById(R.id.bubble_layout_parent);

        // if message is mine then align to right
        if (message.get("user_id").equals(user.get("user_id"))) {
            layout.setBackgroundResource(R.drawable.bubble4);
            parent_layout.setGravity(Gravity.RIGHT);
        }
        // If not mine then align to left
        else {
            layout.setBackgroundResource(R.drawable.bubble3);
            parent_layout.setGravity(Gravity.LEFT);
        }
        msg.setTextColor(Color.WHITE);
        return vi;
    }

    public void add(Map object) {
        messages.add(object);
    }
}