package com.example.atsushiyamamoto.linish;

import java.util.*;
import java.util.zip.Inflater;
//import java.lang.Runnable;
import java.io.IOException;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.provider.Settings;
import android.support.design.widget.TabLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;

import android.support.v4.app.Fragment;
import android.support.v4.app.ListFragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ListView;

import com.google.common.base.Joiner;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;


/**
 * Created by atsushiyamamoto on 7/26/16.
 */
public class FragmentTabFriends extends ListFragment {

    ListView list;
    List<String> friends;
    BaseAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View friendsTabView = inflater.inflate(R.layout.fragment_tab_friends, container, false);
        list = (ListView) friendsTabView.findViewById(android.R.id.list);
        Map resMap = null;
        setHasOptionsMenu(true);
        showFriends();

        return friendsTabView;
    }

    @Override
    public void onStart() {
        super.onStart();
        showFriends();
    }

    protected void showFriends() {
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/friends", getActivity(), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                friends = makeResponseList(response);
                                getActivity().runOnUiThread(new Runnable() {
                                    public void run() {
                                        Context context = getActivity().getApplicationContext();
                                        adapter = new FriendsAdapter(context, friends);
                                        setListAdapter(adapter);
                                        onListItemLongClick();
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

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        super.onCreateOptionsMenu(menu, inflater);
        System.out.println("HOGE");
        System.out.println("HOGE");
        inflater.inflate(R.menu.menu_friends, menu);
    }


    protected void onListItemLongClick() {
        list.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {

            @Override
            public boolean onItemLongClick(AdapterView parent, View view, int position, long id) {
                showListDialog(position);
                return true;
            }
        });
    }

    public void showListDialog(final int position) {
        final CharSequence[] items = {"友だちを削除"};
        Object friendObject = adapter.getItem(position);
        final String friend = friendObject.toString();
        AlertDialog.Builder listDlg = new AlertDialog.Builder(getContext());
        listDlg.setTitle(friend);
        listDlg.setItems(
                items,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        JsonArray friends = new JsonArray();
                        friends.add(friend);
                        deleteRooms(friends, position);
                    }
                }
        );
        listDlg.create().show();
    }

    protected void deleteRooms(JsonArray friendIds, final int position) {
        Context context = getContext();
        final JsonObject json = new JsonObject();
        json.add("user_ids", friendIds);

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                final int pos = position;
                try {
                    postAsync("/friends/delete", json, getActivity(), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            getActivity().runOnUiThread(new Runnable() {
                                public void run() {
                                    synchronized (adapter) {
                                        friends.remove(pos);
                                        adapter.notifyDataSetChanged();
                                    }
                                }
                            });
                        }
                    });
                } catch (IOException e) {

                }
                return null;
            }
        }.execute();
    }
}
