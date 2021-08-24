function shipStatus() {
  
    // STEP 1 - Configure sheet and data to load
    
    var ss =  SpreadsheetApp.openById("enter_aphanumeric_google_sheet_id"); //change this ID to match the google sheets ID
    var sheet = ss.getSheetByName("Data Source"); // tab on the google sheet
    var trackingNumbers = sheet.getRange("A1:AF").getValues(); // pulls in the sheet data. ***** If the worksheet extends beyond W, expand this range ******
    // END STEP 1 
    
   
    // STEP 2 - housekeeping - setting local variables
    
    var lastRow = trackingNumbers.length; // pull #Rows for iterations 
    var LastCol = 35; // pull #Columns for iterations 
    var i = 1;
    var j = 1;
    var d = new Date();
    d.setDate(d.getDate()-100); // sets variable d to be 100 days before today, so we only pull recent shipments
    var trackNbrOutN, trackNbrOutStatusN, trackNbrOutDateN, trackNbrInN, trackNbrInStatusN, trackNbrInDateN, soDateN, errorN; // initialize variables for holding column numbers. Prevents breakage if columns move.
    
    // END STEP 2
    
    // STEP 3 - find the column# from the sheet
  
    while (j < LastCol){ //goes until the last column reached
      
      if (trackingNumbers[1][j] == "Outgoing Tracking #"){ //if the column has the correct label, store the column number
        trackNbrOutN = j;}
       if (trackingNumbers[1][j] == "Ship Date"){
        trackNbrOutDateN = j;}
      if (trackingNumbers[1][j] == "Outgoing Status"){
        trackNbrOutStatusN = j;}
      if (trackingNumbers[1][j] == "Incoming Tracking Number"){
        trackNbrInN = j;}
      if (trackingNumbers[1][j] == "Incoming Status"){
        trackNbrInStatusN = j;}
      if (trackingNumbers[1][j] == "Received Date"){
        trackNbrInDateN = j;}
      if (trackingNumbers[1][j] == "Error"){
        errorN = j;}
      j += 1
    }
    console.log(trackNbrOutN, trackNbrOutStatusN, trackNbrOutDateN, trackNbrInN, trackNbrInStatusN, trackNbrInDateN, errorN); // initialize variables for holding column numbers. Prevents breakage if columns move.
    
    // END STEP 3
  
    // STEP 4 - iterates through each row and pulls in data    
    while (i < lastRow-1){ // lastRow-1 lastRow-1 // Do this for each row in the spreadhseet > 1876 && i < 2500 > 1876 && i < 2500
      //Utilities.sleep(100);
      var trackNbrOut, trackNbrOutStatus, trackNbrIn, trackNbrInStatus, trackNbrInDate, packageStatus, shippedOrBilledDate, deliveryDate, packageStatusIn, shippedOrBilledDateIn, packageStatusOut, shippedOrBilledDateOut, fedExStatus, HTMLfedExStatus, fedExQuery;
      trackNbrOut = null; trackNbrOutStatus = null; trackNbrIn = null; trackNbrInStatus = null; trackNbrInDate = null; packageStatus = null; shippedOrBilledDate = null; deliveryDate = null; packageStatusIn = null; shippedOrBilledDateIn = null; packageStatusOut = null; shippedOrBilledDateOut = null; fedExStatus = null; HTMLfedExStatus = null; fedExQuery = null;
   
      // trackNbrOut, trackNbrOutStatus, trackNbrIn, trackNbrInStatus, soDate, trackNbrInDate, packageStatus, shippedOrBilledDate,deliveryDate,shippedOrBilledDateIn, packageStatusOut, shippedOrBilledDateOut = null;
      
      trackNbrOut = trackingNumbers[i][trackNbrOutN].toString();
      trackNbrOutStatus = trackingNumbers[i][trackNbrOutStatusN];
      trackNbrIn = trackingNumbers[i][trackNbrInN].toString();
      trackNbrInStatus = trackingNumbers[i][trackNbrInStatusN]; 
      trackNbrInDate = trackingNumbers[i][trackNbrInDateN];
      
  
      // populates outbound shipping data
      console.log("trackNbrOut outter",trackNbrOut)
      console.log("trackNbrOut outter",trackNbrIn)
      if (trackNbrOut != "" && trackNbrOutStatus != "Delivered") {
        
        if (trackNbrOut.length == 12){
          // console.log("trackNbrOut inner",trackNbrOut)
          //STEP 2: Query Bing and get FedEx Shipping Status // 
          // FedEx API
          packageStatus = FedExAPI (trackNbrOut);
          console.log("trackNbrOut,packageStatus",trackNbrOut,packageStatus)
          if (packageStatus != null){
             writeSheet (sheet, trackNbrOut, i, packageStatus[1], trackNbrOutDateN, packageStatus[0], trackNbrOutStatusN); // packageStatus = fedExStatus[0]; shippedOrBilledDate = fedExStatus[1];
          }
          else{
            sheet.getRange((i+1),trackNbrOutStatusN+1,1,1).setValue("Not Found");
          }
        }
        
        // UPS API 
        if (trackNbrOut.length == 18){
          packageStatus = UPSAPI(trackNbrOut);
          console.log(packageStatus)
          if (packageStatus != null){
            try{
             packageStatusCurrent = packageStatus[1].split(", ")[1]+'/2020'
             writeSheet (sheet, trackNbrOut, i, packageStatusCurrent, trackNbrOutDateN, packageStatus[0], trackNbrOutStatusN)
            }
              catch(err){console.log("error",trackNbrIn);}
          }
             //writeSheet (sheet, trackNbrOut, i, packageStatus[1], trackNbrOutDateN, packageStatus[0], trackNbrOutStatusN)
          
          else{
            sheet.getRange((i+1),trackNbrOutStatusN+1,1,1).setValue("Not Found");
          }
        }
      }
      
      // populates Inbound shipping data  
      if (trackNbrIn != "" && trackNbrInStatus != "Delivered"){
       
        if (trackNbrIn.length == 12){
          //STEP 2: Query Bing and get FedEx Shipping Status // 
          // FedEx API
          
          packageStatus = FedExAPI (trackNbrIn);
          // console.log("trackNbrIn,packageStatus",trackNbrIn,packageStatus)
          if (packageStatus != null){
             writeSheet (sheet, trackNbrIn, i, packageStatus[1], trackNbrInDateN, packageStatus[0], trackNbrInStatusN); // packageStatus = fedExStatus[0]; shippedOrBilledDate = fedExStatus[1];
          }
          else{
            sheet.getRange((i+1),trackNbrInStatusN+1,1,1).setValue("Not Found");
          }
        }
        
        // UPS API 
        if (trackNbrIn.length == 18){
          packageStatus = UPSAPI(trackNbrIn);
          if (packageStatus != null){
            try{
             packageStatusCurrent = packageStatus[1].split(", ")[1]+'/2020'
             writeSheet (sheet, trackNbrIn, i, packageStatusCurrent, trackNbrInDateN, packageStatus[0], trackNbrInStatusN)
            }
              catch(err){console.log("error",trackNbrIn);}
          }
          else{
            sheet.getRange((i+1),trackNbrInStatusN+1,1,1).setValue("Not Found");
          }
        }
      }
      i++;
    }
    console.log("all done6");
  }
  
  
  function FedExAPI (trackNbr) {
    var fedExQuery = null;
    var HTMLfedExStatus = null;
    var fedExStatus = null;
    var packageStatus = null;
    var shippedOrBilledDate = null;
    
    fedExQuery = 'https://www.bing.com/packagetrackingv2?packNum='+trackNbr+'&carrier=Fedex&FORM=PCKTR1'
    HTMLfedExStatus = UrlFetchApp.fetch(fedExQuery).getContentText();  // Bing Query
    try{
      fedExStatus = HTMLfedExStatus.match(/b_focusTextSmall.*progressBarParent/).toString().split("<")[0].split(">")[1].split(": "); // extracts the delivery status and date and puts in an array
    }
    catch(err){console.log("error",trackNbr);}
    return fedExStatus;
  }
    
  function UPSAPI (trackNbr) {
    
    var UPSQuery = null;
    var HTMLUPSStatus = null;
    var UPSStatus = null;
    var packageStatus = null;
    var shippedOrBilledDate = null;
    
    UPSQuery = 'https://www.bing.com/packagetrackingv2?packNum='+trackNbr+'&carrier=UPS&FORM=PCKTR1'
    HTMLUPSStatus = UrlFetchApp.fetch(UPSQuery).getContentText();  // Bing Query
    try{
      UPSStatus = HTMLUPSStatus.match(/b_focusTextSmall.*progressBarParent/).toString().split("<")[0].split(">")[1].split(": "); // extracts the delivery status and date and puts in an array
    } //
    catch(err){console.log("error",trackNbr);}
    return UPSStatus;
    
    
    /*
    /////// UPS Changed their API and now requires an API key. This method has now been deprecated.
    var data = {'Locale':'en_US','TrackingNumber':[trackNbr]}; 
    var options = {'method' : 'post','contentType': 'application/json','payload' : JSON.stringify(data)};  // Convert the JavaScript object to a JSON string.
    var trackingData = JSON.parse(UrlFetchApp.fetch('https://www.ups.com/track/api/Track/GetStatus?loc=en_US', options));  // gets tracking status from UPS
    var trackStatus = trackingData.statusText; // extracts tracking status
    
    if (trackStatus == "Successful"){
      var packageStatus = trackingData.trackDetails[0].packageStatus;
      var deliveryDate = trackingData.trackDetails[0].deliveredDate;
      try{
        var ShipDate = trackingData.trackDetails[0].additionalInformation.shippedOrBilledDate;
        return [packageStatus,deliveryDate];
      }
      catch(err){
        console.log("ShipDate error");
        return [packageStatus,"NA"];
      }
    }
    */
  }
  
  
  function writeSheet (sheet, trackNbr, i, ShipDate, DateN, ShipStatus, StatusN) {
    
    if (ShipStatus == null){
          output = "Error" + i
          sheet.getRange((i+1),StatusN+1,1,1).setValue("Not Found");
        }
    else {
      var value2 = ShipDate // + " " + i + " " + trackNbr
      sheet.getRange((i+1),DateN+1,1,1).setValue(value2); //shippedOrBilledDateIn
      sheet.getRange((i+1),StatusN+1,1,1).setValue(ShipStatus);
    }
    return;
  }
  
  