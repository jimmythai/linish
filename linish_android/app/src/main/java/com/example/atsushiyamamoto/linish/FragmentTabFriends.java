package com.example.atsushiyamamoto.linish;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.zip.Inflater;
//import java.lang.Runnable;
import java.io.IOException;

import android.app.Activity;
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
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.hosopy.actioncable.ActionCable;
import com.hosopy.actioncable.ActionCableException;
import com.hosopy.actioncable.Channel;
import com.hosopy.actioncable.Consumer;
import com.hosopy.actioncable.Subscription;

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
    Consumer consumer;
    Map<String, ?> account;
    Channel friendsChannel = new Channel("FriendsChannel");
    Channel friendsDeleteChannel = new Channel("FriendsDeleteChannel");

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View friendsTabView = inflater.inflate(R.layout.fragment_tab_friends, container, false);
        list = (ListView) friendsTabView.findViewById(android.R.id.list);
        Map resMap = null;
        setHasOptionsMenu(true);
        showFriends();
        getAccountInformation();
        System.out.println("onCreateView");

        return friendsTabView;
    }

    protected void getAccountInformation() {
        new API() {
            @Override
            protected String doInBackground(Void... params) {
                try {
                    getAsync("/accounts", getActivity(), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            try {
                                account = makeResponseMap(response);
                                final Activity activity = getActivity();
                                activity.runOnUiThread(new Runnable() {
                                    public void run() {
                                        try {
                                            String actionCableUri = new API().makeActionCableUri();
                                            URI uri = new URI(actionCableUri);
                                            consumer = ActionCable.createConsumer(uri);

                                            String userId = account.get("user_id").toString();
                                            receiveAddFriendsAction(userId);
                                            receiveRemoveFriendsAction(userId);

                                            consumer.connect();
                                        } catch (URISyntaxException e) {
                                            e.printStackTrace();
                                        }
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

    public void receiveAddFriendsAction(final String userId) {

            Subscription subscription = consumer.getSubscriptions().create(friendsChannel);

            subscription.onConnected(new Subscription.ConnectedCallback() {
                @Override
                public void call() {
                    System.out.print("YAY!");
                }
            });
            subscription.onRejected(new Subscription.RejectedCallback() {
                @Override
                public void call() {
                    System.out.print("NO WAY!");
                }
            });
            subscription.onReceived(new Subscription.ReceivedCallback() {
                @Override
                public void call(final JsonElement data) {
                    System.out.println("RECEIVED");
                    if(getActivity() == null)
                        return;

                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            JsonObject gsonData = data.getAsJsonObject();
                            String followerId = gsonData.get("follower_id").getAsString();
                            String followedId = gsonData.get("followed_id").getAsString();

                            if (followedId.equals(userId)) {
                                friends.add(followerId);
                                Collections.sort(friends);
                                adapter.notifyDataSetChanged();
                            }
                        }
                    });
                }
            });
            subscription.onDisconnected(new Subscription.DisconnectedCallback() {
                @Override
                public void call() {
                    System.out.print("Bye");
                }
            });
            subscription.onFailed(new Subscription.FailedCallback() {
                @Override
                public void call(ActionCableException e) {
                    System.out.print("OH NO!");
                }
            });


    }

    public void receiveRemoveFriendsAction(final String userId) {

            Subscription subscription = consumer.getSubscriptions().create(friendsDeleteChannel);

            subscription.onConnected(new Subscription.ConnectedCallback() {
                @Override
                public void call() {
                    System.out.print("YAY!");
                }
            });
            subscription.onRejected(new Subscription.RejectedCallback() {
                @Override
                public void call() {
                    System.out.print("NO WAY!");
                }
            });
            subscription.onReceived(new Subscription.ReceivedCallback() {
                @Override
                public void call(final JsonElement data) {
                    System.out.println("RECEIVED");
                    if(getActivity() == null)
                        return;

                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            JsonObject gsonData = data.getAsJsonObject();
                            String deletingId = gsonData.get("deleting_id").getAsString();
                            String deletedId = gsonData.get("deleted_id").getAsString();

                            if(deletedId.equals(userId)) {
                                int position = friends.indexOf(deletingId);
                                friends.remove(position);
                                adapter.notifyDataSetChanged();
                            }
                        }
                    });
                }
            });

            subscription.onDisconnected(new Subscription.DisconnectedCallback() {
                @Override
                public void call() {
                    System.out.print("Bye");
                }
            });
            subscription.onFailed(new Subscription.FailedCallback() {
                @Override
                public void call(ActionCableException e) {
                    System.out.print("OH NO!");
                }
            });
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

    @Override
    public void onResume() {
        super.onResume();
        showFriends();
        System.out.println("onResume");
    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("onPause");
        consumer.disconnect();
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
