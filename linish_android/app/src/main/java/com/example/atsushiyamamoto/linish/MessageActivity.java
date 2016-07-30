package com.example.atsushiyamamoto.linish;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;

public class MessageActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_message);

        Intent intent = getIntent();
        ArrayList<String> membersArray = intent.getStringArrayListExtra("membersArray");
        String separator = ", ";
        String members = StringUtils.join(membersArray, separator).replaceAll("\"", "");
        setTitle(members);
    }
}
