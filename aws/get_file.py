from datetime import datetime, timedelta
from time import sleep, time
import boto3
from creds import Prod_SF_Login, Dev_SF_Login

s3 = boto3.resource("s3")
my_bucket = s3.Bucket("bucket_name")  # replace bucket_name with your bucket's name
d1 = str((datetime.today() - timedelta(1)).strftime("%Y%m%d"))

print(d1)
for file in my_bucket.objects.all():
    key = file.key
    key_str = str(key)
    # print (key_str,d1)
    sf = Prod_SF_Login()
    start_time = time()
    today = str(datetime.now())

    if d1 in key and "keyword" in key:
        print(file.key)
        # Download csv file from SFTP server
        my_bucket.download_file(key, "/keyword.csv")

        # Count the number of records in the csv
        record_count = 0
        with open("/keyword.csv") as f:
            record_count = sum(1 for line in f)

        end_time = time()
        run_time = str(end_time - start_time)

        # Add to API Log to track update
        Name = "SFTP " + today
        record = {
            "Name": Name,
            "Script__c": "keyword",
            "Records_Processed__c": record_count,
            "Records_Successful__c": record_count,
            "Run_Time__c": run_time,
        }
        new_API_record = sf.API_Log__c.create(record)

        # body = file.get()['Body'].read()
        # print(body)
"""
import boto3
s3 = boto3.resource('s3')
my_bucket = s3.Bucket('bucket_name')
for file in my_bucket.objects.all():
    print(file.key)
"""
