package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import android.support.v4.app.Fragment;
import android.support.v4.app.ListFragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link FragmentTabSetting.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link FragmentTabSetting#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentTabSetting extends ListFragment {
    Context context;

    final Class<?>[] ActivityClassName = {
            SignoutActivity.class,
            DeleteAccountActivity.class
    };

    private Class<?> callActivityClassName(int position) {
        return ActivityClassName[position];
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View settingTabView = inflater.inflate(R.layout.fragment_tab_setting, container, false);
        this.context = getActivity().getApplicationContext();
        ListView list = (ListView) settingTabView.findViewById(android.R.id.list);

        SettingAdapter adapter = new SettingAdapter(context, SettingItemList);
        setListAdapter(adapter);

        return settingTabView;
    }

    @Override
    public void onListItemClick(ListView l, View v, int position, long id) {
        Intent intent = new Intent(this.context, callActivityClassName(position));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        this.context.startActivity(intent);
    }

    public static final String[] SettingItemList = {
            "ログアウト", "退会"
    };
}
