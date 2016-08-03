package com.example.atsushiyamamoto.linish;

import android.content.Context;
import android.os.AsyncTask;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;
import android.provider.Settings;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
//import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.List;

import okhttp3.FormBody;
import okhttp3.FormBody.Builder;
import okhttp3.OkHttpClient;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * Created by atsushiyamamoto on 7/25/16.
 */

public class API extends AsyncTask<Void, Void, String> {

    public API() {
        super();
    }

    final public static String HOSTNAME = "http://192.168.100.179:3000";
    final public static String SUB_DIRECTORY = "/api";
    final public static String API_VERSION = "/v1";
    final public static String PREF_NAME = "linish_prefs";

    final public static String ACTIONCABLE_HOSTNAME = "ws://192.168.100.179:3000";
    final public static String ACTIONCABLE_SUB_DIRECTORY = "/cable";

    public static OkHttpClient client = new OkHttpClient();
    public static Gson gson = new Gson();
    public static String url;
    public static String res;
    public static Map resMap;
    public static List resList;
    public static Response response;

    @Override
    protected String doInBackground(Void... params) {
        return null;
    }

    public static String makeUrl(String path) {
        return HOSTNAME + SUB_DIRECTORY + API_VERSION + path;
    }

    public static String makeActionCableUri() {
        return ACTIONCABLE_HOSTNAME + ACTIONCABLE_SUB_DIRECTORY;
    }

    public static String makeUrlWithAccessToken(String path, Context context) {
        return makeUrl(path) + "?access_token=" + getAccessToken(context);
    }

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static String getAccessToken(Context context) {
        return getPrefs(context).getString("access_token", "default_access_token");
    }

    public static void setAccessToken(String input, Context context) {
        SharedPreferences.Editor editor = getPrefs(context).edit();
        editor.putString("access_token", input);
        editor.commit();
    }

    public static Map makeResponseMap(Response response) throws IOException {
        res = response.body().string();
        resMap = gson.fromJson(res, Map.class);
        return  resMap;
    }

    public static List makeResponseList(Response response) throws IOException {
        res = response.body().string();
        resList = gson.fromJson(res, List.class);
        return  resList;
    }

    public static Map post(String path, FormBody formBody, Context context) throws IOException {
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");

        Request request = new Request.Builder()
                .url(url)
                .post(formBody)
                .build();

        response = client.newCall(request).execute();
        return makeResponseMap(response);
    }

    public static Map get(String path, Context context) throws IOException {
        if (path == "/accounts/signin" || path == "/accounts/signup") {
            url = makeUrl(path);
        } else {
            url = makeUrlWithAccessToken(path, context);
        }

        Request request = new Request.Builder()
                .url(url)
                .build();

        response = client.newCall(request).execute();
        return makeResponseMap(response);
    }

    public void postAsync(String path, JsonObject json, Context context, final Callback callback) throws IOException {

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            url = makeUrl(path);

            if(path != "/accounts/signin" || path != "/accounts/signup") {
                json.addProperty("access_token", getAccessToken(context));
            }

            final String jsonString = json.toString();

            RequestBody body = RequestBody.create(JSON, jsonString);

            final Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    callback.onFailure(null, e);
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    System.out.println(request);
//                    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                    callback.onResponse(null, response);
                }
            });
    }

    public static void getAsync(String path, Context context, final Callback callback) throws IOException {
        if (path == "/accounts/signin" || path == "/accounts/signup") {
            url = makeUrl(path);
        } else {
            url = makeUrlWithAccessToken(path, context);
        }

        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                callback.onFailure(null, e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
//                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                callback.onResponse(null, response);
            }
        });
    }
}
