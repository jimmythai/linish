package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.TextView;

import java.util.List;

public class AddChatAdapter extends BaseAdapter {

    private List<String> friends;
    private LayoutInflater mLayoutInflater;
    private Context context;
    private int checkAccumulator;
    private Button button;

    public AddChatAdapter(Context context, List<String> friends, Button button) {
        this.friends = friends;
        this.checkAccumulator = 0;
        this.button = button;

        mLayoutInflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return friends.size();
    }

    @Override
    public String getItem(int position) {
        String friend = friends.get(position);
        return friend;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (null == convertView) {
            convertView = mLayoutInflater.inflate(R.layout.add_chat_item, null);
        }

        final TextView user;
        final CheckBox checkBox;
        final Button startChatButton;
        String separator = ",";
        user = (TextView) convertView.findViewById(R.id.userId);
        checkBox = (CheckBox) convertView.findViewById(R.id.chatCheckBox);

        user.setText(getItem(position));

        convertView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (checkBox.isChecked()) {
                    checkBox.setChecked(false);
                    checkAccumulator--;
                } else {
                    checkBox.setChecked(true);
                    checkAccumulator++;
                }
                if (checkAccumulator == 0) {
                    button.setText("選択");
                } else {
                    button.setText("選択(" + checkAccumulator + ")");
                }
            }

        });

        return convertView;
    }
}
