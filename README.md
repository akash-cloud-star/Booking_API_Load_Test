# Booking_API_Load_Test

Dear,

### I’ve completed performance test on frequently used API for test site (https://reqres.in).
### Test executed for the below mentioned scenario in server (https://reqres.in).


* 800 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 54 And Total Concurrent API requested: 4800.
* 1200 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 100 And Total Concurrent API requested: 7200.
* 1400 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 74 And Total Concurrent API requested: 8400.
* 1600 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 73 And Total Concurrent API requested: 9600.

While executed 1600 concurrent request, found 1090 request got connection timeout and error rate is 11.35%.

Summary: Server can handle almost concurrent 1500 API call with almost zero (0) error rate.Please find the details report from the attachment and let me know if you have any further queries.

# Report Image:
![Screenshot 2023-06-10 211743](https://github.com/akash-cloud-star/Booking_API_Load_Test/assets/61002722/8c51b0b4-382a-4957-a4e8-e1de5412ca4d)
![Screenshot 2023-06-10 211805](https://github.com/akash-cloud-star/Booking_API_Load_Test/assets/61002722/86c3e049-073b-4855-9a13-158188540dd2)


