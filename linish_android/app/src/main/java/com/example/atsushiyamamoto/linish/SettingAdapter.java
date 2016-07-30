package com.example.atsushiyamamoto.linish;

import android.content.Intent;
import android.content.Context;
import android.provider.Settings;
import android.text.Layout;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.TextView;
import android.widget.LinearLayout;
import android.widget.AdapterView;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Text;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;


/**
 * Created by atsushiyamamoto on 7/26/16.
 */
public class SettingAdapter extends BaseAdapter  {

    private String[] settingItems;
    private LayoutInflater mLayoutInflater;

    public SettingAdapter(Context context, String[] settingItems) {
        this.settingItems = settingItems;
        mLayoutInflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
//        this.context = context;
    }

    @Override
    public int getCount() {
        return settingItems.length;
    }

    @Override
    public String getItem(int position) {
        return settingItems[position];
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (null == convertView) {
            convertView = mLayoutInflater.inflate(R.layout.setting_item, null);
        }

        TextView settingItem;
        TextView hoge;
        settingItem = (TextView) convertView.findViewById(R.id.setting_item);
        settingItem.setText(getItem(position));

        hoge = (TextView) convertView.findViewById(R.id.setting_item);
        System.out.println(hoge.getText());

        return convertView;
    }
}
