import requests
import logging
from time import sleep
from datetime import date, datetime, timedelta
from creds import (
    Bearer_Token,
    Prod_SF_Login,
    Dev_SF_Login,
    Unwiredlabs_Token,
    Snowflake
)
from json import loads, dumps
import pandas as pd
import snowflake.connector
from pandas.io import sql
import numpy as np


def main():
    with open("log.txt", "w") as myfile:  # clears the log file
        log_line = f"{date.today()} \n"
        myfile.write(log_line)

    conn = connect()
    snapshot(conn)
    return ()


# 2 get heartbeats
def snapshot(conn):
    query = """
        insert into db.raw.asset_scd2
        select asset.name as name,
        asset.status as status, sales_type as sales_type,
        CURRENT_TIMESTAMP(0) as _timestamp, FALSE as _deleted
        from salesforce.asset as asset
        left join db.raw.asset_scd2 as asset_snapshot on (asset.name = asset_snapshot.name)
        where asset.is_deleted = 'False'
        and (asset_snapshot._timestamp < date_from_parts(year(current_date()), month(current_date()), 1) or asset_snapshot._timestamp is null)
        """
    Snowflake_df = sql.read_sql_query(query, conn)
    return ()


def connect():
    user, password = Snowflake()
    # print (user,password)
    conn = snowflake.connector.connect(
        user=user,
        password=password,
        account="account.west-us-2.azure",
        warehouse="WH",
        database="DB",
        schema="schema",
    )
    session = conn.session_id
    query_staus = conn.get_query_status
    network_timeout = conn.network_timeout
    error_list = conn.is_an_error
    return conn



# 2 Roc Auth

if __name__ == "__main__":
    main()
