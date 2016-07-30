package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;


/**
 * Created by atsushiyamamoto on 7/26/16.
 */
public class FriendsAdapter extends BaseAdapter {

    private List<String> friends;
    private LayoutInflater mLayoutInflater;

    public FriendsAdapter(Context context, List<String> friends) {
        this.friends = friends;
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
            convertView = mLayoutInflater.inflate(R.layout.friends_item, null);
        }

        TextView user;
        String separator = ",";
        user = (TextView) convertView.findViewById(R.id.userId);
        user.setText(getItem(position));

        return convertView;
    }
}
