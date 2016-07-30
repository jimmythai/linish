package com.example.atsushiyamamoto.linish;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.List;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.text.ParseException;
import org.joda.time.DateTime;
import org.joda.time.format.*;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.google.common.base.Joiner;
import com.google.common.base.Objects;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;


import org.apache.commons.lang3.StringUtils;


/**
 * Created by atsushiyamamoto on 7/27/16.
 */
public class ChatsAdapter extends BaseAdapter {
    private List<Map<String, Object>> rooms;
    private LayoutInflater mLayoutInflater;

    public ChatsAdapter(Context context, List<Map<String, Object>> rooms) {
        this.rooms = rooms;
        mLayoutInflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return rooms.size();
    }

    @Override
    public Map<String, Object> getItem(int position) {
        Map<String, Object> room =  new HashMap<String, Object>();
        Map roomGson = rooms.get(position);
        room.put("room_id", roomGson.get("room_id"));
        room.put("updated_at", roomGson.get("updated_at"));
        room.put("user_ids", roomGson.get("user_ids"));
        return room;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (null == convertView) {
            convertView = mLayoutInflater.inflate(R.layout.chats_item, null);
        }

        String separator = ",";
        TextView usersText;
        TextView dateText;

        usersText = (TextView) convertView.findViewById(R.id.users);
        dateText = (TextView) convertView.findViewById(R.id.date);

        Map room = getItem(position);
        List<String> users = (List<String>) room.get("user_ids");
        Object dateTimeString = room.get("updated_at");

        String usersString;
        if (users.isEmpty()) {
            usersString = "Empty room";
        } else {
            usersString = Joiner.on(", ").join(users);
        }
        usersText.setText(usersString);

        String dateTimeStringT = dateTimeString.toString().replace("T", " ");
        String dateTimeStringZ = dateTimeStringT.replace(".000Z", "");
        DateTimeFormatter dateParser = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
        DateTime dateTime = dateParser.parseDateTime(dateTimeStringZ);
        DateTimeFormatter dateFormatter = DateTimeFormat.forPattern("yy/M/d H:m:s");
        dateText.setText(dateFormatter.print(dateTime));

        return convertView;
    }


}
