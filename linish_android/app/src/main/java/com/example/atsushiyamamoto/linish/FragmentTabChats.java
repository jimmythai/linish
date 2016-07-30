package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;

import android.support.v4.app.ListFragment;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemLongClickListener;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import java.beans.*;

import com.google.common.base.Joiner;
import com.google.common.collect.Interner;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Response;

import org.apache.commons.*;



/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link FragmentTabChats.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link FragmentTabChats#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentTabChats extends ListFragment {

    ListView list;
    List<Map<String, Object>> rooms;
    BaseAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View RoomsTabView = inflater.inflate(R.layout.fragment_tab_chats, container, false);
        list = (ListView) RoomsTabView.findViewById(android.R.id.list);
        setHasOptionsMenu(true);
        showRooms();

        return RoomsTabView;
    }

    @Override
    public void onStart() {
        super.onStart();
        showRooms();
    }

    protected void showRooms() {
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/rooms", getActivity(), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                rooms = makeResponseList(response);
                                getActivity().runOnUiThread(new Runnable() {
                                    public void run() {
                                        Context context = getActivity().getApplicationContext();
                                        adapter = new ChatsAdapter(context, rooms);
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
        final CharSequence[] items = {"ルームを削除"};
        Object roomObject = adapter.getItem(position);
        final Map<String, Object> room = (Map) roomObject;
        AlertDialog.Builder listDlg = new AlertDialog.Builder(getContext());
        List<String> users = (List<String>) room.get("user_ids");
        final String usersString;
        if (users.isEmpty()) {
            usersString = "Empty room";
        } else {
            usersString = Joiner.on(", ").join(users);
        }
        listDlg.setTitle(usersString);
        listDlg.setItems(
                items,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        JsonArray room_ids = new JsonArray();
                        Double roomId = (Double) room.get("room_id");
                        room_ids.add(roomId.intValue());
                        deleteRooms(room_ids, position);
                    }
                }
        );
        listDlg.create().show();
    }

    @Override
    public void onListItemClick(ListView l, View v, int position, long id) {
//        Intent intent = new Intent(this.context, callActivityClassName(position));
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        this.context.startActivity(intent);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        super.onCreateOptionsMenu(menu, inflater);
        inflater.inflate(R.menu.menu_chats, menu);
    }

    protected void deleteRooms(JsonArray room_ids, final int position) {
        Context context = getContext();
        final JsonObject json = new JsonObject();
        json.add("room_ids", room_ids);

        new API() {
            @Override
            protected String doInBackground(Void... params) {
                final int pos = position;
                try {
                    postAsync("/rooms/delete", json, getActivity(), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            getActivity().runOnUiThread(new Runnable() {
                                public void run() {
                                    synchronized (adapter) {
                                        rooms.remove(pos);
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
