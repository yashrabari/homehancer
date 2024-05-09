const db = require('./db');
const helper = require('../helper');
const jwt  = require('jsonwebtoken')
const config = require('../config');
const otp = require('../OTP-Generate');

const admin = require('../firebase-config');



const fetch = (...args) => import('node-fetch').then(({ default: fetch }) =>
    fetch(...args));

async function getMultiple(){
  let data =[];
console.log(Date.now());
  return {
    data,
  }
}

async function login(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Error in creating programming language';
  let status =false;
  let data =[];
  let token="";
  let generateOTP=otp.generateOTP();

  if(programmingLanguage.mobile.length>=10){
    console.log(`select user_id,name,email,mobile,user_type from tbl_person where mobile ='${programmingLanguage.mobile}'`);
    const result = await db.query(
      `select user_id,name,email,mobile,user_type from tbl_person where mobile ='${programmingLanguage.mobile}' `
    );
    if(result.length>0){
      if(programmingLanguage.mobile=="9157691572"){

        message = 'User update successfully';
        status=true;
        data = helper.emptyOrRows(result);
        
      }else{



        console.log(`update tbl_person set otp ='${generateOTP}',fcm_token='${programmingLanguage.fcm_token}' where mobile ='${programmingLanguage.mobile}' `);
        const updateResult = await db.query(
          `update tbl_person set otp ='${generateOTP}',fcm_token='${programmingLanguage.fcm_token}' where mobile ='${programmingLanguage.mobile}' `
        );
        if (updateResult.affectedRows) {
          try {
            const apiResponse = await fetch(
              `https://www.fast2sms.com/dev/bulkV2?authorization=1ih7jRXsGrWtqDgQMbJUPuApyHvk5z0YOxSNwfI28mcd9BZ43oMfKqDSHoAJP4CmF5TnYuVjwzREk6dN&variables_values=${generateOTP}&route=otp&numbers=${programmingLanguage.mobile}`
            )
            const apiResponseJson = await apiResponse.json()
            console.log(apiResponseJson["return"]);
            if(apiResponseJson["return"]==true){
              message = 'User update successfully';
              status=true;
              data = helper.emptyOrRows(result);
            }else{
              message =  apiResponseJson["message"];
              status=false;
            }
            
            console.log(apiResponseJson)
          } catch (err) {
            console.log(err)
          }
      
        }

      }

      


    }else{
      console.log(`insert into tbl_person (email,name,mobile,otp,fcm_token) values('','',"${programmingLanguage.mobile}","${generateOTP}",'${programmingLanguage.fcm_token}')`);
      const result1 = await db.query(
          `insert into tbl_person (email,name,mobile,otp,fcm_token) values('','',"${programmingLanguage.mobile}","${generateOTP}",'${programmingLanguage.fcm_token}')`
      );
      if (result1.affectedRows) {
        try {
          const apiResponse = await fetch(
            `https://www.fast2sms.com/dev/bulkV2?authorization=1ih7jRXsGrWtqDgQMbJUPuApyHvk5z0YOxSNwfI28mcd9BZ43oMfKqDSHoAJP4CmF5TnYuVjwzREk6dN&variables_values=${generateOTP}&route=otp&numbers=${programmingLanguage.mobile}`
          )
          const apiResponseJson = await apiResponse.json()
          
          console.log(apiResponseJson["return"]);
          if(apiResponseJson["return"]==true){

            console.log(`select user_id,name,email,mobile,user_type,fcm_token from tbl_person where mobile ='${programmingLanguage.mobile}'`);
    const result = await db.query(
      `select user_id,name,email,mobile,user_type,fcm_token from tbl_person where mobile ='${programmingLanguage.mobile}' `
    );
    if(result.length>0){
      message = 'User created successfully';

      status=true;
      data = helper.emptyOrRows(result);
    }
            
          }else{
            message = apiResponseJson["message"];
            status=false;
          }
          
          console.log(apiResponseJson)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }else{
    message="Enter vaild number";
    console.log("enter vaild number");
  }

  return {message,status,data,token};
}



async function signup(programmingLanguage){
  console.log(programmingLanguage);
  
  
  let message = 'Error in creating programming language';
  let status =false;
  let token ="";
  
  let data =[];
  
  console.log(programmingLanguage.mobile);
  if(!programmingLanguage.body.mobile){
    message='Enter Mobile Number'
  }
  else if(!programmingLanguage.body.email){
    message='Enter Email Address'
  }
  else if(!programmingLanguage.body.name){
    message='Enter User Name'
  }else if(!programmingLanguage.file){
    console.log(`update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' where mobile ='${programmingLanguage.body.mobile}' `);
  const updateResult = await db.query(
      `update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' where mobile ='${programmingLanguage.body.mobile}'  `
    );
    if (updateResult.affectedRows) {
      console.log(`
      select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile ='${programmingLanguage.body.mobile}' `);
        const result = await db.query(
          `
          select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile ='${programmingLanguage.body.mobile}' `
        );
        if(result.length==1){
          console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'User update successfully';
          status=true;
          token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
          data = helper.emptyOrRows(result);
        }

    }else{
      message = 'Wrong User Details';
    }
  }else{
  console.log(`update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' ,user_image='${programmingLanguage.file.filename}' where mobile ='${programmingLanguage.body.mobile}' `);
  const updateResult = await db.query(
      `update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' ,user_image='${programmingLanguage.file.filename}' where mobile ='${programmingLanguage.body.mobile}'  `
    );
    if (updateResult.affectedRows) {
      console.log(`
      select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile ='${programmingLanguage.body.mobile}' `);
        const result = await db.query(
          `
          select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile ='${programmingLanguage.body.mobile}' `
        );
        if(result.length==1){
          console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'User update successfully';
          status=true;
          token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
          data = helper.emptyOrRows(result);
        }
     
    }else{
      message = 'Wrong User Details';
    }
  }

  return {message,status,data,token};
}


async function newToken(programmingLanguage){
  console.log(programmingLanguage);
  
  
  let message = 'Error in creating programming language';
  let status =false;
  let token ="";
  
  let data =[];
  
  console.log(programmingLanguage.user_id);
  if(!programmingLanguage.body.user_id){
    message='Enter User Id'
  }else if(!programmingLanguage.body.user_type){
    message='Enter User Type'
  } else{
    message = 'User update successfully';
    status=true;
    token= otp.generateJwtToken(programmingLanguage.body.user_id,programmingLanguage.body.user_type)
    data = [];
  }

  return {message,status,data,token};
}


async function sendNotification(programmingLanguage){
  console.log(programmingLanguage);
  
  
  let status =false;
  let token ="";
  
  let data =[];
  
  admin.messaging().send(message).then((response) => {
    console.log('Successfully sent message: ', response);
    })
    .catch((error) => {
    console.log('Error sending message: ', error);
    });


  return {message,status,data,token};
}


async function editProfile(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Error in creating programming language';
  let status =false;
  let token ="";
  let data =[];
  console.log(programmingLanguage.headers);
  // try{

  if(!programmingLanguage.headers['authorization']){
message="Enter authorization";
  }else if(!programmingLanguage.body.name){
    message="Enter name";
  }else if(!programmingLanguage.body.email){
    message="Enter email";
  }else if(!programmingLanguage.file){
    try{


      var bearerHeader = programmingLanguage.headers['authorization'];
      jwtResponse=otp.verifyJwtToken(bearerHeader);

      console.log(`update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}'  where user_id ='${jwtResponse["id"]}' `);
      const updateResult = await db.query(
          `update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' where user_id ='${jwtResponse["id"]}' `
      );
      if (updateResult.affectedRows) {
          console.log(`
          select user_id,name,email,mobile,user_type,user_image from tbl_person where user_id ='${jwtResponse["id"]}' `);
            const result = await db.query(
              `
              select user_id,name,email,mobile,user_type,user_image from tbl_person where user_id ='${jwtResponse["id"]}' `
            );
            if(result.length==1){
              console.log(helper.emptyOrRows(result)[0]["user_id"]);
              message = 'User update successfully';
              status=true;
              token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
              data = helper.emptyOrRows(result);
            }

        }
      }catch(err){
        message=err.message
      }
  }else{
    try{

    
    var bearerHeader = programmingLanguage.headers['authorization'];
    jwtResponse=otp.verifyJwtToken(bearerHeader);
    
    console.log(`update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}' ,user_image='${programmingLanguage.file.filename}' where user_id ='${jwtResponse["id"]}' `);
    const updateResult = await db.query(
        `update tbl_person set name ='${programmingLanguage.body.name}' , email ='${programmingLanguage.body.email}',user_image='${programmingLanguage.file.filename}' where user_id ='${jwtResponse["id"]}' `
    );
    if (updateResult.affectedRows) {
        console.log(`
        select user_id,name,email,mobile,user_type,user_image from tbl_person where user_id ='${jwtResponse["id"]}' `);
          const result = await db.query(
            `
            select user_id,name,email,mobile,user_type,user_image from tbl_person where user_id ='${jwtResponse["id"]}' `
          );
          if(result.length==1){
            console.log(helper.emptyOrRows(result)[0]["user_id"]);
            message = 'User update successfully';
            status=true;
            token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
            data = helper.emptyOrRows(result);
          }
       
      }
    }catch(err){
      message=err.message
    }
  }

  return {message,status,data,token};
 
}



async function deleteUser(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Error in creating programming language';
  let status =false;
  let token ="";
  let data =[];
  

  if(!programmingLanguage.headers['authorization']){
    message="Enter authorization";
  }else{
    try{

    
    var bearerHeader = programmingLanguage.headers['authorization'];
    jwtResponse=otp.verifyJwtToken(bearerHeader);
    
    console.log(`delete from tbl_person where user_id = '${jwtResponse["id"]}' `);
    const updateResult = await db.query(
        `delete from tbl_person where user_id = '${jwtResponse["id"]}' `
    );
    if (updateResult.affectedRows) {
    message = "Delete User";
    status = true;

    }
    }catch(err){
      
      message=err.message
    }
  }

  return {message,status,data,token};
 
}



async function deleteEmp(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Error in creating programming language';
  let status =false;

  let data =[];
  
  console.log(`delete from tbl_person where user_id = '${programmingLanguage.query.id}' and user_type='customer'  `);
  const updateResult = await db.query(
      `delete from tbl_person where user_id = '${programmingLanguage.query.id}' and user_type='customer'`
  );
  if (updateResult.affectedRows) {
  message = "Delete User";
  status = true;

  }

  return {message,status,data};
 
}


async function verifyOTP(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Invaild Number or OTP';
  let status =false;
  let token ="";
  
  let data =[];
  
  console.log(`select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile='${programmingLanguage.mobile}' and otp='${programmingLanguage.otp}'`);
    const result = await db.query(
      ` select user_id,name,email,mobile,user_type,user_image from tbl_person where mobile='${programmingLanguage.mobile}' and otp='${programmingLanguage.otp}'`
    );
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Vaild OTP successfully';
      status=true;
      token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data,token};
}


async function changeImage(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Error in creating programming language';
  let status =false;
  let token ="";
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  
  console.log(`update tbl_person set user_image="${programmingLanguage.file.filename}" where user_id='${jwtResponse["id"]}'`);
  const updateResult = await db.query(
      `update tbl_person set user_image="${programmingLanguage.file.filename}" where user_id='${jwtResponse["id"]}'`
    );
    if (updateResult.affectedRows) {
      console.log(`
      select * from tbl_person where user_id ='${jwtResponse["id"]}' `);
        const result = await db.query(
          `
          select * from tbl_person where user_id ='${jwtResponse["id"]}' `
        );
        if(result.length==1){
          console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'User update successfully';
          status=true;
          token= otp.generateJwtToken(helper.emptyOrRows(result)[0]["user_id"],helper.emptyOrRows(result)[0]["user_type"])
          data = helper.emptyOrRows(result);
        }
     
    }
    
  return {message,status,data,token};
}


async function addBanner(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`insert into tbl_banner(name,image) values ('${programmingLanguage.filename}','${programmingLanguage.filename}')`);
    const result = await db.query(
      `insert into tbl_banner(name,image) values ('${programmingLanguage.filename}','${programmingLanguage.filename}')`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Banner successfully';
      status=true;
  
    }

    
  return {message,status,data};
}


async function editBanner(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`update tbl_banner set name='${programmingLanguage.file.filename}' , image='${programmingLanguage.file.filename}' where banner_id=${programmingLanguage.body.id}`);
    const result = await db.query(
      `update tbl_banner set name='${programmingLanguage.file.filename}' , image='${programmingLanguage.file.filename}' where banner_id=${programmingLanguage.body.id}`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Banner successfully';
      status=true;
  
    }

    
  return {message,status,data};
}




async function setMostBookService(req){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`update tbl_service_detail set is_most_book_service =${req.body.is_most_book_service} where service_id = ${req.body.service_id}`);
    const result = await db.query(
      `update tbl_service_detail set is_most_book_service =${req.body.is_most_book_service} where service_id = ${req.body.service_id}`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Service successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function setOfferService(req){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  if(req.body.offer_per==0){
    console.log(`
    update  tbl_service_detail set is_offer = 0 , offer_per = '${req.body.offer_per}' where service_id = ${req.body.service_id}`);
      const result = await db.query(
        `update  tbl_service_detail set is_offer = 0 , offer_per = '${req.body.offer_per}' where service_id = ${req.body.service_id}`
      );
      if(result.affectedRows){
        // console.log(helper.emptyOrRows(result)[0]["user_id"]);
        message = 'Edit Service successfully';
        status=true;

      }
  }else{
    console.log(`
    update  tbl_service_detail set is_offer = 1 , offer_per = '${req.body.offer_per}' where service_id = ${req.body.service_id}`);
      const result = await db.query(
        `update  tbl_service_detail set is_offer = 1 , offer_per = '${req.body.offer_per}' where service_id = ${req.body.service_id}`
      );
      if(result.affectedRows){
        // console.log(helper.emptyOrRows(result)[0]["user_id"]);
        message = 'Edit Service successfully';
        status=true;

      }
  }



    
  return {message,status,data};
}



async function editServiceDetails(req){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  if(req.file){

    var service_desc =req.body.service_desc.replace("'","\'");
    console.log("service_desc");
    console.log(service_desc);
    var full_desc=req.body.full_desc.replace("'","\'");
    // console.log(`update tbl_service_detail set service_name='${req.body.service_name}'  , price ='${req.body.service_price}' , short_desc="${ service_desc}", full_desc ="${ full_desc}",sub_service_id='${req.body.sub_service_id}',image='${req.file.filename}' where service_id='${req.body.service_id}'`);
    const result = await db.query(
      `update tbl_service_detail set service_name='${req.body.service_name}'  , price ='${req.body.service_price}' , short_desc="${ service_desc}", full_desc ="${full_desc}",sub_service_id='${req.body.sub_service_id}',image='${req.file.filename}' where service_id='${req.body.service_id}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Service successfully';
      status=true;
  
    }
  }
  else{
    var service_desc =req.body.service_desc.replace("'","\\'");
    console.log("service_desc");
    console.log(service_desc);
    var full_desc=req.body.full_desc.replace("'","\\'");
    console.log(`update tbl_service_detail set service_name='${req.body.service_name}'  , price ='${req.body.service_price}' , short_desc='${service_desc}', full_desc ='${full_desc}',sub_service_id='${req.body.sub_service_id}' where service_id='${req.body.service_id}'`);
    const result = await db.query(
      `update tbl_service_detail set service_name='${req.body.service_name}'  , price ='${req.body.service_price}' , short_desc='${service_desc}', full_desc ='${full_desc}',sub_service_id='${req.body.sub_service_id}' where service_id='${req.body.service_id}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Service successfully';
      status=true;
  
    }
  }
  
  return {message,status,data};
}



async function editSubService(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`update tbl_sub_service set sub_service_name = '${programmingLanguage.body.sub_service_name}' , service_id='${programmingLanguage.body.service_id}' where sub_service_id =${programmingLanguage.body.sub_service_id}`);
    const result = await db.query(
      `update tbl_sub_service set sub_service_name = '${programmingLanguage.body.sub_service_name}' , service_id='${programmingLanguage.body.service_id}' where sub_service_id =${programmingLanguage.body.sub_service_id}`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Banner successfully';
      status=true;
  
    }

    
  return {message,status,data};
}


async function editThought(programmingLanguage,id){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  console.log(programmingLanguage['thought-file']);
  console.log(programmingLanguage['thought-video']);

if(programmingLanguage['thought-video']){
  console.log(`update tbl_thought set thought_video_url='${programmingLanguage['thought-video'][0].filename}' where thought_id=${id}`);
  const result = await db.query(
    `update tbl_thought set thought_video_url='${programmingLanguage['thought-video'][0].filename}' where thought_id=${id}`
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Edit Thought successfully';
    status=true;

  }
 
}
if(programmingLanguage['thought-file']){
  console.log(`update tbl_thought set thought_name='${programmingLanguage['thought-file'][0].filename}' , thought_image='${programmingLanguage['thought-file'][0].filename}'  where thought_id=${id}`);
  const result = await db.query(
    `update tbl_thought set thought_name='${programmingLanguage['thought-file'][0].filename}' , thought_image='${programmingLanguage['thought-file'][0].filename}'  where thought_id=${id}`
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Edit Thought successfully';
    status=true;

  }
}
  

    
  return {message,status,data};
}


async function addClient(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  let generateOTP=otp.generateOTP();

  
  console.log(`insert into tbl_person(name,email,mobile,otp,user_image)
  values('${programmingLanguage.body.name}','${programmingLanguage.body.email}','${programmingLanguage.body.mobile}','${generateOTP}','${programmingLanguage.file.filename}')
  `);
    const result = await db.query(
      `insert into tbl_person(name,email,mobile,otp,user_image)
      values('${programmingLanguage.body.name}','${programmingLanguage.body.email}','${programmingLanguage.body.mobile}','${generateOTP}','${programmingLanguage.file.filename}')
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Client successfully';
      status=true;
  
    }

    
  return {message,status,data};
}

async function addServicesDepartment(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  


  console.log(`insert into tbl_service(name,image) values ('${programmingLanguage.body.name}','${programmingLanguage.file.filename}')`);
    const result = await db.query(
      `insert into tbl_service(name,image) values ('${programmingLanguage.body.name}','${programmingLanguage.file.filename}')`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function editServicesDepartment(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
if(req.file){

  console.log(`update tbl_service set name='${programmingLanguage.body.name}' , image='${programmingLanguage.file.filename}' where s_id='${programmingLanguage.body.id}'`);
    const result = await db.query(
      `update tbl_service set name='${programmingLanguage.body.name}' , image='${programmingLanguage.file.filename}' where s_id='${programmingLanguage.body.id}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }

}else{
  console.log(`update tbl_service set name='${programmingLanguage.body.name}' where s_id='${programmingLanguage.body.id}'`);
    const result = await db.query(
      `update tbl_service set name='${programmingLanguage.body.name}' where s_id='${programmingLanguage.body.id}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }
}

    
  return {message,status,data};
}



async function editPersonDetails(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
if(programmingLanguage.file){

  console.log(`
  update tbl_person set name='${programmingLanguage.body.name}' ,email='${programmingLanguage.body.email}',mobile='${programmingLanguage.body.mobile}',user_image='${programmingLanguage.file.filename}'  where user_id='${programmingLanguage.body.user_id}'
  `);
    const result = await db.query(
      `
      update tbl_person set name='${programmingLanguage.body.name}' ,email='${programmingLanguage.body.email}',mobile='${programmingLanguage.body.mobile}',user_image='${programmingLanguage.file.filename}'  where user_id='${programmingLanguage.body.user_id}'
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }

}else{
  console.log(`
  update tbl_person set name='${programmingLanguage.body.name}' ,email='${programmingLanguage.body.email}',mobile='${programmingLanguage.body.mobile}'  where user_id='${programmingLanguage.body.user_id}'
  `);
    const result = await db.query(
      `update tbl_person set name='${programmingLanguage.body.name}' ,email='${programmingLanguage.body.email}',mobile='${programmingLanguage.body.mobile}'  where user_id='${programmingLanguage.body.user_id}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }
}

    
  return {message,status,data};
}



async function addServiceDetail(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`insert into tbl_service_detail(service_name,price,short_desc,full_desc,sub_service_id,is_most_book_service,image)  values("${programmingLanguage.body.service_name}",${programmingLanguage.body.service_price},"${programmingLanguage.body.service_desc}","${programmingLanguage.body.full_desc}",${programmingLanguage.body.sub_service_id},${programmingLanguage.body.is_most_book_service},"${programmingLanguage.file.filename}")`);
    const result = await db.query(
      `insert into tbl_service_detail(service_name,price,short_desc,full_desc,sub_service_id,is_most_book_service,image)  values("${programmingLanguage.body.service_name}",${programmingLanguage.body.service_price},"${programmingLanguage.body.service_desc}","${programmingLanguage.body.full_desc}",${programmingLanguage.body.sub_service_id},${programmingLanguage.body.is_most_book_service},"${programmingLanguage.file.filename}")`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Services Department successfully';
      status=true;
  
    }

    
  return {message,status,data};
}

async function addSubServices(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  insert into tbl_sub_service(sub_service_name,service_id) values("${programmingLanguage.sub_service}","${programmingLanguage.service_id}")`);
    const result = await db.query(
      `insert into tbl_sub_service(sub_service_name,service_id) values("${programmingLanguage.sub_service}","${programmingLanguage.service_id}")`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Sub Services Department successfully';
      status=true;
  
    }

    
  return {message,status,data};
}
async function setPin(programmingLanguage){
  console.log(programmingLanguage);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  if(jwtResponse["user_type"]=="technician"){
  console.log(`update tbl_technician set pin='${programmingLanguage.body.pin}' where user_id='${jwtResponse["id"]}'`);
    const result = await db.query(
      `update tbl_technician set pin='${programmingLanguage.body.pin}' where user_id='${jwtResponse["id"]}'`
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Banner successfully';
      status=true;
  
    }
  }else{
    message = 'Wrong Authorization Key';
    status=false;
  }

    
  return {message,status,data};
}



async function addPuchIn(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  if(jwtResponse["user_type"]=="technician"){
  console.log(`
  
  insert into tbl_timesheet(time_date,time_shift_type,user_id,user_punch_in_time,user_punch_in_latitude,user_punch_in_longitude)
values(CURRENT_DATE(),"Day","${jwtResponse["id"]}",CURRENT_TIME(),"${programmingLanguage.body.user_punch_in_latitude}","${programmingLanguage.body.user_punch_in_longitude}")

  
  `);
    const result = await db.query(
      `  
      insert into tbl_timesheet(time_date,time_shift_type,user_id,user_punch_in_time,user_punch_in_latitude,user_punch_in_longitude)
    values(CURRENT_DATE(),"Day","${jwtResponse["id"]}",CURRENT_TIME(),"${programmingLanguage.body.user_punch_in_latitude}","${programmingLanguage.body.user_punch_in_longitude}")
    `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Sub Services Department successfully';
      status=true;
  
    }
  }else{
    message = 'Wrong Authorization Key';
      status=false;
  }
    
  return {message,status,data};
}



async function addPuchOut(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  if(jwtResponse["user_type"]=="technician"){
  console.log(`
    update  tbl_timesheet set user_punch_out_time=CURRENT_TIME(),user_punch_out_date=CURRENT_DATE(),user_punch_out_latitude='${programmingLanguage.body.user_punch_out_latitude}',user_punch_out_longitude='${programmingLanguage.body.user_punch_out_longitude}',user_punch_out_image='${programmingLanguage.file.filename}' where time_id=${programmingLanguage.body.time_id}
  `);
    const result = await db.query(
      `
      update  tbl_timesheet set user_punch_out_time=CURRENT_TIME(),user_punch_out_date=CURRENT_DATE(),user_punch_out_latitude='${programmingLanguage.body.user_punch_out_latitude}',user_punch_out_longitude='${programmingLanguage.body.user_punch_out_longitude}',user_punch_out_image='${programmingLanguage.file.filename}' where time_id=${programmingLanguage.body.time_id}
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Sub Services Department successfully';
      status=true;
  
    }
  }else{
    message = 'Wrong Authorization Key';
      status=false;
  }
    
  return {message,status,data};
}


async function addCount(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  if(!programmingLanguage.body.service_id){
    message = 'Enter Service Id';
  }else 
  if(!programmingLanguage.body.category_id){
    message = 'Enter Category Id';
  }else{
    console.log(`
    select t4.s_id from add_to_cart  t1
    LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
    LEFT JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id
    LEFT JOIN tbl_service t4 ON t3.service_id = t4.s_id
    where user_id=${jwtResponse["id"]}  and cart_status=1
    group by t4.s_id
    `);

    const result = await db.query(
      `
      select t4.s_id from add_to_cart  t1
    LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
    LEFT JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id
    LEFT JOIN tbl_service t4 ON t3.service_id = t4.s_id
    where user_id=${jwtResponse["id"]}  and cart_status=1
    group by t4.s_id
      `
    );

    if(result.length>0){
      if(helper.emptyOrRows(result)[0]["s_id"]==programmingLanguage.body.category_id){
          console.log("Same value");

          console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
          const result = await db.query(
            `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
          );
          if(result.length>0){
          
            console.log(`update add_to_cart set count = count+1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1
            `);
            const updateResult = await db.query(
              `update add_to_cart set count = count+1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
            );
            if(updateResult.affectedRows){
              console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
            const fianlResult = await db.query(
              `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
            );
            message = 'Add Sub Services Department successfully';
            status=true;
            data=helper.emptyOrRows(fianlResult);
          
            }
          }else{
            console.log(`insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`);
            const insertResult = await db.query(
              `insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`
            );

            if(insertResult.affectedRows){
              console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
            const fianlResult = await db.query(
              `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
            );
            message = 'Add Sub Services Department successfully';
            status=true;
            data=helper.emptyOrRows(fianlResult);
          
            }
          }      
   
   
        }else{
        
        console.log(`
        delete from add_to_cart where user_id=${jwtResponse["id"]}  and cart_status=1`);
        const result = await db.query(
          `
          delete from add_to_cart where user_id=${jwtResponse["id"]}  and cart_status=1
          `
        );

        console.log(`insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`);
        const insertResult = await db.query(
          `insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`
        );

        if(insertResult.affectedRows){
          console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
        const fianlResult = await db.query(
          `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );
        message = 'Add Sub Services Department successfully';
        status=true;
        data=helper.emptyOrRows(fianlResult);
      
        }

      }
    }else{

      console.log(`insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`);
        const insertResult = await db.query(
          `insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`
        );

        if(insertResult.affectedRows){
          console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
        const fianlResult = await db.query(
          `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );
        message = 'Add Sub Services Department successfully';
        status=true;
        data=helper.emptyOrRows(fianlResult);
      
        }
    }
  }

 
    
  return {message,status,data};
}




async function addCountOrder(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
    const result = await db.query(
      `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

      console.log(`update add_to_cart set count = count+1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1
      `);
      const updateResult = await db.query(
        `update add_to_cart set count = count+1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
      );
      console.log(updateResult);
      if(updateResult.affectedRows){
        console.log(`select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`);
      const fianlResult = await db.query(
        `select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`
      );
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(fianlResult);
    
      }
     
  
    }else{
      console.log(`insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`);
    const insertResult = await db.query(
      `insert into add_to_cart(user_id,service_id,count,cart_status) values(${jwtResponse["id"]},${programmingLanguage.body.service_id},1,1)`
    );
    if(insertResult.affectedRows){
      console.log(`select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`);
      const fianlResult = await db.query(
        `select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`
      );
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(fianlResult);
    
    }
    }

    
  return {message,status,data};
}


async function removeCount(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
    const result = await db.query(
      `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
    );
    
    if(result.length>0){
      console.log(helper.emptyOrRows(result)[0]["count"]);
      if(helper.emptyOrRows(result)[0]["count"]<= "1"){
        console.log(`delete from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
        const result = await db.query(
          `delete from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );

        message = 'Remove from cart successfully';
        status=true;
        data=[];
      }else{


        console.log(`update add_to_cart set count = count-1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1
        `);
        const updateResult = await db.query(
          `update add_to_cart set count = count-1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );
        console.log(updateResult);
        if(updateResult.affectedRows){
          console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
        const fianlResult = await db.query(
          `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );
        message = 'Add to Cart successfully';
        status=true;
        data=helper.emptyOrRows(fianlResult);
      
        }
      }

      
    }

    
  return {message,status,data};
}



async function removeCountOrder(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
    const result = await db.query(
      `select * from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      console.log(helper.emptyOrRows(result)[0]["count"]);
      if(helper.emptyOrRows(result)[0]["count"]<= "1"){
        console.log(`delete from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`);
        const result = await db.query(
          `delete from add_to_cart where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );

        message = 'Remove from cart successfully';
        status=true;
        data=[];
      }else{


        console.log(`update add_to_cart set count = count-1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1
        `);
        const updateResult = await db.query(
          `update add_to_cart set count = count-1 where user_id=${jwtResponse["id"]} and service_id=${programmingLanguage.body.service_id} and cart_status=1`
        );
        console.log(updateResult);
        if(updateResult.affectedRows){
          console.log(`select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
          LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
          where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`);
        const fianlResult = await db.query(
          `select t1.*,t2.service_name,(t2.price*t1.count) total_price from add_to_cart t1
          LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
          where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}`
        );
        message = 'Add Sub Services Department successfully';
        status=true;
        data=helper.emptyOrRows(fianlResult);
      
        }
       
      }

    
  
    }

    
  return {message,status,data};
}




async function addLocation(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  let data =[];
  
  console.log(`
  insert into tbl_location (user_id,user_name,user_mobile,user_city,user_house,user_building,user_landmark,user_location_type,user_address,user_lat_long)
  values(${jwtResponse["id"]},"${programmingLanguage.body.user_name}","${programmingLanguage.body.user_mobile}","${programmingLanguage.body.user_city}","${programmingLanguage.body.user_house}","${programmingLanguage.body.user_building}","${programmingLanguage.body.user_landmark}","${programmingLanguage.body.user_type}","${programmingLanguage.body.user_address}","${programmingLanguage.body.user_lat_long}")
  `);
    const result = await db.query(
      `
      insert into tbl_location (user_id,user_name,user_mobile,user_city,user_house,user_building,user_landmark,user_location_type,user_address,user_lat_long)
      values(${jwtResponse["id"]},"${programmingLanguage.body.user_name}","${programmingLanguage.body.user_mobile}","${programmingLanguage.body.user_city}","${programmingLanguage.body.user_house}","${programmingLanguage.body.user_building}","${programmingLanguage.body.user_landmark}","${programmingLanguage.body.user_type}","${programmingLanguage.body.user_address}","${programmingLanguage.body.user_lat_long}")
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Sub Services Department successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function addLocationAdmin(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;

  let data =[];
  
  console.log(`
  insert into tbl_location (user_id,user_name,user_mobile,user_city,user_house,user_building,user_landmark,user_location_type,user_address,user_lat_long)
  values(${programmingLanguage.body.user_id},"${programmingLanguage.body.user_name}","${programmingLanguage.body.user_mobile}","${programmingLanguage.body.user_city}","${programmingLanguage.body.user_house}","${programmingLanguage.body.user_building}","${programmingLanguage.body.user_landmark}","${programmingLanguage.body.user_type}","${programmingLanguage.body.user_address}","${programmingLanguage.body.user_lat_long}")
  `);
    const result = await db.query(
      `
      insert into tbl_location (user_id,user_name,user_mobile,user_city,user_house,user_building,user_landmark,user_location_type,user_address,user_lat_long)
      values(${programmingLanguage.body.user_id},"${programmingLanguage.body.user_name}","${programmingLanguage.body.user_mobile}","${programmingLanguage.body.user_city}","${programmingLanguage.body.user_house}","${programmingLanguage.body.user_building}","${programmingLanguage.body.user_landmark}","${programmingLanguage.body.user_type}","${programmingLanguage.body.user_address}","${programmingLanguage.body.user_lat_long}")
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Add Sub Services Department successfully';
      status=true;
  
    }

    
  return {message,status,data};
}





async function editLocation(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  let data =[];
  console.log(`
  update tbl_location set user_name = '${programmingLanguage.body.user_name}' ,user_mobile='${programmingLanguage.body.user_mobile}' ,user_city='${programmingLanguage.body.user_city}',user_house='${programmingLanguage.body.user_house}',user_building='${programmingLanguage.body.user_building}' , user_landmark='${programmingLanguage.body.user_landmark}' ,user_location_type='${programmingLanguage.body.user_type}',user_address='${programmingLanguage.body.user_address}' , user_lat_long='${programmingLanguage.body.user_lat_long}'
where user_id='${jwtResponse["id"]}' and user_location_id='${programmingLanguage.body.user_location_id}'

  `);
    const result = await db.query(
      `
      update tbl_location set user_name = '${programmingLanguage.body.user_name}' ,user_mobile='${programmingLanguage.body.user_mobile}' ,user_city='${programmingLanguage.body.user_city}',user_house='${programmingLanguage.body.user_house}',user_building='${programmingLanguage.body.user_building}' , user_landmark='${programmingLanguage.body.user_landmark}' ,user_location_type='${programmingLanguage.body.user_type}',user_address='${programmingLanguage.body.user_address}' , user_lat_long='${programmingLanguage.body.user_lat_long}'
      where user_id='${jwtResponse["id"]}' and user_location_id='${programmingLanguage.body.user_location_id}'
       
      `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Edit Location successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function placeOrder(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  let data =[];
  
  console.log(`
  update temp set job_id=job_id+1
  `);
    const result = await db.query(
      `
      update temp set job_id=job_id+1
      `
    );

    if(result.affectedRows){
      console.log(`
      select * from temp
      `);
        const result1 = await db.query(
          `
          select * from temp
          `
        );

        if(result1.length>0){
          console.log(helper.emptyOrRows(result1)[0]["job_id"]);
          console.log(`
          update add_to_cart set cart_status=2,start_time='${programmingLanguage.body.start_time}',service_date='${programmingLanguage.body.service_date}',address_id='${programmingLanguage.body.address_id}' , job_id=${helper.emptyOrRows(result1)[0]["job_id"]} ,is_night=${programmingLanguage.body.is_night} where user_id=${jwtResponse["id"]} and cart_status=1
          `);
            const result2 = await db.query(
              `
              update add_to_cart set cart_status=2,start_time='${programmingLanguage.body.start_time}',service_date='${programmingLanguage.body.service_date}',address_id='${programmingLanguage.body.address_id}', job_id=${helper.emptyOrRows(result1)[0]["job_id"]} ,is_night=${programmingLanguage.body.is_night} where user_id=${jwtResponse["id"]} and cart_status=1
              `
            );
            if(result2.affectedRows){
              // console.log(helper.emptyOrRows(result)[0]["user_id"]);
              message = 'Your order placed';
              status=true;
          
            }else{
              message = 'No Data found in Cart';
              status=true;
            }
        }
      status=true;
  
    }

  return {message,status,data};
}




async function addJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  console.log(`
  update temp set job_id=job_id+1
  `);
    const result = await db.query(
      `
      update temp set job_id=job_id+1
      `
    );

    if(result.affectedRows){

      console.log(`
      select * from temp
      `);
        const result1 = await db.query(
          `
          select * from temp
          `
        );

        if(result1.length>0){

          console.log(helper.emptyOrRows(result1)[0]["job_id"]);
          console.log(`

          insert into add_to_cart (user_id,service_id,count,cart_status,start_time,service_date,address_id,job_id)
          values("${programmingLanguage.body.user_id}","${programmingLanguage.body.service_id}","${programmingLanguage.body.count}","2","${programmingLanguage.body.start_time}","${programmingLanguage.body.service_date}",'${programmingLanguage.body.address_id}','${helper.emptyOrRows(result1)[0]["job_id"]}')
      
        `);
        const result = await db.query(
          `
            insert into add_to_cart (user_id,service_id,count,cart_status,start_time,service_date,address_id,job_id)
            values("${programmingLanguage.body.user_id}","${programmingLanguage.body.service_id}","${programmingLanguage.body.count}","2","${programmingLanguage.body.start_time}","${programmingLanguage.body.service_date}",'${programmingLanguage.body.address_id}','${helper.emptyOrRows(result1)[0]["job_id"]}')
          `
        );

        if(result.affectedRows){
          // console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'Add Sub Services Department successfully';
          status=true;
      
        }
        }




    }

    
  return {message,status,data};
}



async function rejectJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  update tbl_assign_tech set current_status = 3 where assign_id=${programmingLanguage.body.assign_id} and current_status=0 and tech_id=${jwtResponse["id"]}

  `);
  const result = await db.query(
    `
    update tbl_assign_tech set current_status = 3 where assign_id=${programmingLanguage.body.assign_id} and current_status=0 and tech_id=${jwtResponse["id"]}
    `
  );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Reject Job successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function addAppFeedback(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  insert into app_feedback(feedback_rating,feedback_msg,user_id) values("${programmingLanguage.body.feedback_rating}","${programmingLanguage.body.feedback_msg}","${jwtResponse["id"]}")

  `);
  const result = await db.query(
    `
    insert into app_feedback(feedback_rating,feedback_msg,user_id) values("${programmingLanguage.body.feedback_rating}","${programmingLanguage.body.feedback_msg}","${jwtResponse["id"]}")
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Add Rating successfully';
    status=true;
  }

    
  return {message,status,data};
}



async function deleteLocation(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  delete from tbl_location where user_location_id=${programmingLanguage.body.location_id} and user_id= ${jwtResponse["id"]}

  `);
  const result = await db.query(
    `
    delete from tbl_location where user_location_id=${programmingLanguage.body.location_id} and user_id= ${jwtResponse["id"]}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}





async function deleteThought(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`

  delete from tbl_thought where thought_id=${programmingLanguage.query.id}

  `);
  const result = await db.query(
    `
    delete from tbl_thought where thought_id=${programmingLanguage.query.id}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}



async function deleteBanner(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`

  delete from tbl_banner where banner_id=${programmingLanguage.query.id}

  `);
  const result = await db.query(
    `
    delete from tbl_banner where banner_id=${programmingLanguage.query.id}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}




async function deleteServiceDetails(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`

  delete from tbl_service_detail where service_id =${programmingLanguage.query.id}

  `);
  const result = await db.query(
    `
    delete from tbl_service_detail where service_id =${programmingLanguage.query.id}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}




async function deleteSubService(req){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`

  delete from tbl_sub_service where sub_service_id =${req.query.id}

  `);
  const result = await db.query(
    `
    delete from tbl_sub_service where sub_service_id =${req.query.id}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}





async function deleteServiceDept(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`

  delete from tbl_service where s_id=${programmingLanguage.query.id}

  `);
  const result = await db.query(
    `
    delete from tbl_service where s_id=${programmingLanguage.query.id}
    `
  );
  if(result.affectedRows){
    // console.log(helper.emptyOrRows(result)[0]["user_id"]);
    message = 'Delete Location successfully';
    status=true;
  }

    
  return {message,status,data};
}


async function getMonthlyReport(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`

  SELECT Month(STR_TO_DATE(t1.service_date,'%d %M %Y')),Year(STR_TO_DATE(t1.service_date,'%d %M %Y')),sum(t2.material_amt),sum(t2.cash_amt) FROM add_to_cart t1 left join tbl_payment_details t2 on t1.job_id=t2.job_id left join tbl_location t3 on t3.user_location_id=t1.address_id left join tbl_assign_tech t4 on t4.cart_id=t1.job_id where cart_status in (10,11) and t4.tech_id=${jwtResponse["id"]} GROUP BY Month(STR_TO_DATE(t1.service_date,'%d %M %Y')),Year(STR_TO_DATE(t1.service_date,'%d %M %Y'))


  `);
  const result = await db.query(
    `
    SELECT Month(STR_TO_DATE(t1.service_date,'%d %M %Y')),Year(STR_TO_DATE(t1.service_date,'%d %M %Y')),sum(t2.material_amt),sum(t2.cash_amt) FROM add_to_cart t1 left join tbl_payment_details t2 on t1.job_id=t2.job_id left join tbl_location t3 on t3.user_location_id=t1.address_id left join tbl_assign_tech t4 on t4.cart_id=t1.job_id where cart_status in (10,11) and t4.tech_id=${jwtResponse["id"]} GROUP BY Month(STR_TO_DATE(t1.service_date,'%d %M %Y')),Year(STR_TO_DATE(t1.service_date,'%d %M %Y'))
    `
  );
  if(result.length>0){

    message = 'Get Job History successfully';
    status=true;
    data=helper.emptyOrRows(result);
  

  }

    
  return {message,status,data};
}


async function getTechJobHistory(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`

  
  SELECT t1.job_id,t1.start_time,t1.service_date,t3.user_address,t2.material_amt,t2.cash_amt 
  FROM add_to_cart t1 
  left join tbl_payment_details t2 on t1.job_id=t2.job_id 
  left join tbl_location t3 on t3.user_location_id=t1.address_id 
  left join tbl_assign_tech t4 on t4.cart_id=t1.job_id 
  where cart_status in (10,11) and t4.tech_id=${jwtResponse["id"]} and Month(STR_TO_DATE(t1.service_date,'%d %M %Y'))=${programmingLanguage.body.month} and Year(STR_TO_DATE(t1.service_date,'%d %M %Y'))=${programmingLanguage.body.year}
  GROUP BY t1.job_id,t1.start_time,t1.service_date,t3.user_address,t2.material_amt,t2.cash_amt;

  `);
  const result = await db.query(
    `
   
    
  
  SELECT t1.job_id,t1.start_time,t1.service_date,t3.user_address,t2.material_amt,t2.cash_amt 
  FROM add_to_cart t1 
  left join tbl_payment_details t2 on t1.job_id=t2.job_id 
  left join tbl_location t3 on t3.user_location_id=t1.address_id 
  left join tbl_assign_tech t4 on t4.cart_id=t1.job_id 
  where cart_status in (10,11) and t4.tech_id=${jwtResponse["id"]} and Month(STR_TO_DATE(t1.service_date,'%d %M %Y'))=${programmingLanguage.body.month} and Year(STR_TO_DATE(t1.service_date,'%d %M %Y'))=${programmingLanguage.body.year}
  GROUP BY t1.job_id,t1.start_time,t1.service_date,t3.user_address,t2.material_amt,t2.cash_amt;
    `
  );
  if(result.length>0){

    message = 'Get Job History successfully';
    status=true;
    data=helper.emptyOrRows(result);
  

  }

    
  return {message,status,data};
}




async function setOntheWay(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  SELECT * FROM tbl_assign_tech where current_status in(5,7,9) and tech_id=${jwtResponse["id"]}
'

  `);
  const result = await db.query(
    `
    SELECT * FROM tbl_assign_tech where current_status in(5,7,9) and tech_id=${jwtResponse["id"]}
    `
  );

  if(result.length<1){

    
  console.log(`

  update tbl_assign_tech set current_status	 = 5 where cart_id= ${programmingLanguage.body.cart_id} and current_status=2 and tech_id='${jwtResponse["id"]}'

  `);
  const result = await db.query(
    `
    update tbl_assign_tech set current_status	 = 5 where cart_id= ${programmingLanguage.body.cart_id} and current_status=2 and tech_id='${jwtResponse["id"]}'
    `
  );
    if(result.affectedRows){

    
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Set On my way successfully';
      status=true;
  
    }

  }else{
    message="Already On the way job";
  }

  return {message,status,data};
}




async function setHoldJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  update tbl_assign_tech set current_status	 = 6 where cart_id= ${programmingLanguage.body.cart_id} and current_status in('9','7') and tech_id='${jwtResponse["id"]}'

  `);
  const result = await db.query(
    `
    update tbl_assign_tech set current_status	 = 6 where cart_id= ${programmingLanguage.body.cart_id} and current_status in('9','7') and tech_id='${jwtResponse["id"]}' 
    `
  );
    if(result.affectedRows){
      console.log(`
        insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long,msg_image) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.hold_msg}","Hold By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}","${programmingLanguage.file.filename}")
      `);
      const insertresult = await db.query(
        `
          insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long,msg_image) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.hold_msg}","Hold By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}","${programmingLanguage.file.filename}")
        `
      );
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Set On hold job successfully';
      status=true;
  
    }

    
  return {message,status,data};
}



async function setResumeJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  update tbl_assign_tech set current_status	 = 7 where cart_id= ${programmingLanguage.body.cart_id} and current_status='6' and tech_id='${jwtResponse["id"]}'

  `);
  const result = await db.query(
    `
    update tbl_assign_tech set current_status	 = 7 where cart_id= ${programmingLanguage.body.cart_id} and current_status='6' and tech_id='${jwtResponse["id"]}' 
    `
  );
    if(result.affectedRows){
      console.log(`
        insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long,msg_image) values("${programmingLanguage.body.cart_id}","","Resume By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}","")
      `);
      const insertresult = await db.query(
        `
          insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long,msg_image) values("${programmingLanguage.body.cart_id}","","Resume By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}","")
        `
      );
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Set On Resume job successfully';
      status=true;
  
    }

    
  return {message,status,data};
}


async function setVerfityJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  if(!programmingLanguage.body.otp){
    message='Enter OTP';
  }else if(!programmingLanguage.body.cart_id){
    message='Enter cart id';
  }else{


    console.log(`

    SELECT * FROM tbl_timeline where job_id='${programmingLanguage.body.cart_id}'
  
    `);
    const result = await db.query(
      `
      SELECT * FROM tbl_timeline where job_id='${programmingLanguage.body.cart_id}'

      `);

      

  if(result.length>0){
    console.log(helper.emptyOrRows(result)[0]["verify_otp"]);
    if(helper.emptyOrRows(result)[0]["verify_otp"]==programmingLanguage.body.otp){

      console.log(`

      update tbl_assign_tech set current_status	 = 11 where cart_id= ${programmingLanguage.body.cart_id} and current_status='1' and tech_id='${jwtResponse["id"]}'
    
      `);
      const result = await db.query(
        `
        update tbl_assign_tech set current_status	 = 11 where cart_id= ${programmingLanguage.body.cart_id} and current_status='1' and tech_id='${jwtResponse["id"]}' 
        `
      );
        if(result.affectedRows){
         
          // console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'Set On Verify job successfully';
          status=true;
      
        }else{
          message = 'Updation Failed';
        }
    }else{
      message='inviald otp'
    }
  }else{
    message='no cart found'
  }


  }
    
  return {message,status,data};
}



async function sendCompleteOTP(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  let generateOTP=otp.generateOTP();
  let generateOTP1=otp.generateOTP();

   
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);

  console.log(`SELECT t2.mobile FROM add_to_cart t1 left join tbl_person t2 on t2.user_id=t1.user_id where job_id ='${programmingLanguage.body.job_id}' GROUP by t2.mobile
  `);
  const result = await db.query(
    `SELECT t2.mobile FROM add_to_cart t1 left join tbl_person t2 on t2.user_id=t1.user_id where job_id ='${programmingLanguage.body.job_id}' GROUP by t2.mobile `
  );

  if(result.length>0){
    console.log(helper.emptyOrRows(result)[0]["mobile"]);

    console.log(`update tbl_timeline set complete_otp ='${generateOTP}',verify_otp='${generateOTP1}' where job_id ='${programmingLanguage.body.job_id}' `);
    const updateResult = await db.query(
      `update tbl_timeline set complete_otp ='${generateOTP}' ,verify_otp='${generateOTP1}' where job_id ='${programmingLanguage.body.job_id}' `
    );

     if (updateResult.affectedRows) {
          try {
            const apiResponse = await fetch(
              `https://www.fast2sms.com/dev/bulkV2?authorization=1ih7jRXsGrWtqDgQMbJUPuApyHvk5z0YOxSNwfI28mcd9BZ43oMfKqDSHoAJP4CmF5TnYuVjwzREk6dN&variables_values=${generateOTP}&route=otp&numbers=${helper.emptyOrRows(result)[0]["mobile"]}`
            )
            const apiResponseJson = await apiResponse.json()
            console.log(apiResponseJson["return"]);
            if(apiResponseJson["return"]==true){
              message = 'Send OTP successfully';
              status=true;
              data = [];
            }else{
              message =  apiResponseJson["message"];
              status=false;
            }
            
            console.log(apiResponseJson)
          } catch (err) {
            console.log(err)
          }
      
        }else{
          message='something went wrong'
        }
  
  }else{
    message='no user found'
  } 
  return {message,status,data};
}


// async function sendVerifyOTP(programmingLanguage){
//   console.log(programmingLanguage.body);
//   let message = 'Something went wrong';
//   let status =false;
  
//   let data =[];
  
//   let generateOTP=otp.generateOTP();

   
//   var bearerHeader = programmingLanguage.headers['authorization'];
//   jwtResponse=otp.verifyJwtToken(bearerHeader);

//   console.log(`select user_id,name,email,mobile,user_type from tbl_person where user_id ='${jwtResponse["id"]}'`);
//   const result = await db.query(
//     `select user_id,name,email,mobile,user_type from tbl_person where user_id ='${jwtResponse["id"]}' `
//   );

//   if(result.length>0){
//     console.log(helper.emptyOrRows(result)[0]["mobile"]);

//     console.log(`update tbl_timeline set verify_otp ='${generateOTP}' where job_id ='${programmingLanguage.body.job_id}' `);
//     const updateResult = await db.query(
//       `update tbl_timeline set verify_otp ='${generateOTP}' where job_id ='${programmingLanguage.body.job_id}' `
//     );

//      if (updateResult.affectedRows) {
//           try {
//             const apiResponse = await fetch(
//               `https://www.fast2sms.com/dev/bulkV2?authorization=1ih7jRXsGrWtqDgQMbJUPuApyHvk5z0YOxSNwfI28mcd9BZ43oMfKqDSHoAJP4CmF5TnYuVjwzREk6dN&variables_values=${generateOTP}&route=otp&numbers=${helper.emptyOrRows(result)[0]["mobile"]}`
//             )
//             const apiResponseJson = await apiResponse.json()
//             console.log(apiResponseJson["return"]);
//             if(apiResponseJson["return"]==true){
//               message = 'Send OTP successfully';
//               status=true;
//               data = [];
//             }else{
//               message =  apiResponseJson["message"];
//               status=false;
//             }
            
//             console.log(apiResponseJson)
//           } catch (err) {
//             console.log(err)
//           }
      
//         }
  
//   } 
//   return {message,status,data};
// }



async function setCompleteJob(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  if(!programmingLanguage.body.otp){
    message = 'Enter OTP';
  }else if(!programmingLanguage.body.cart_id){
    message = 'Enter Job ID';
  }
  else{

    console.log(`
    SELECT * FROM tbl_assign_tech where current_status in(7,9) and cart_id=${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]};


    `);
    const vaildCompleted = await db.query(
      `
      SELECT * FROM tbl_assign_tech where current_status in(7,9) and cart_id=${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]};
      `
    );
    if(vaildCompleted.length>0){

      console.log(`
      select * from tbl_timeline where job_id='${programmingLanguage.body.cart_id}'
    
      `);
      const result = await db.query(
        `
        select * from tbl_timeline where job_id='${programmingLanguage.body.cart_id}'
        `
      );
      if(result.length>0){
      
       if( helper.emptyOrRows(result)[0]["complete_otp"]==programmingLanguage.body.otp){
        
    
    
      console.log(`
    
      update tbl_assign_tech set current_status	 = 1 where cart_id= ${programmingLanguage.body.cart_id}  and tech_id='${jwtResponse["id"]}'
    
      `);
      const result = await db.query(
        `
        update tbl_assign_tech set current_status	 = 1 where cart_id= ${programmingLanguage.body.cart_id}  and tech_id='${jwtResponse["id"]}' 
        `
      );
          console.log(`
    
      update add_to_cart set cart_status	 = 10 where job_id= '${programmingLanguage.body.cart_id}'
    
      `);
      const result11 = await db.query(
        `
        update add_to_cart set cart_status	 = 10 where job_id= '${programmingLanguage.body.cart_id}' 
        `
      );
    
    
      console.log(`
      insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","","Completed By Tech","${programmingLanguage.body.end_date}","${programmingLanguage.body.end_time}","${programmingLanguage.body.job_msg_lat_long}")
      `);
        const insertresultCom = await db.query(
          `
          insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","","Completed By Tech","${programmingLanguage.body.end_date}","${programmingLanguage.body.end_time}","${programmingLanguage.body.job_msg_lat_long}")
          `
        );
    
      console.log(`
    
      insert into tbl_payment_details(cash_amt,material_amt,payment_status,bill_image,work_image,job_id) values("${programmingLanguage.body.cash_amt}","${programmingLanguage.body.material_amt}","${programmingLanguage.body.payment_status}","${programmingLanguage.files['bill-image'][0].filename}","${programmingLanguage.files['work-image'][0].filename}","${programmingLanguage.body.cart_id}")
    
      `);
      const resultInsert = await db.query(
        `
        insert into tbl_payment_details(cash_amt,material_amt,payment_status,bill_image,work_image,job_id) values("${programmingLanguage.body.cash_amt}","${programmingLanguage.body.material_amt}","${programmingLanguage.body.payment_status}","${programmingLanguage.files['bill-image'][0].filename}","${programmingLanguage.files['work-image'][0].filename}","${programmingLanguage.body.cart_id}")
        `
      );
    
      console.log(`
    
      update tbl_timeline set end_date =   '${programmingLanguage.body.end_date}' , end_time =   '${programmingLanguage.body.end_time}' where job_id= '${programmingLanguage.body.cart_id}'
    
      `);
      const result1 = await db.query(
        `
        update tbl_timeline set end_date =   '${programmingLanguage.body.end_date}' , end_time =   '${programmingLanguage.body.end_time}' where job_id= '${programmingLanguage.body.cart_id}'
        `
      );
          // console.log(helper.emptyOrRows(result)[0]["user_id"]);
          message = 'Set On Completed job successfully';
          status=true;
      
        
    
    
    
       }else{
        message='Invaild OTP'
       }
      
      }else{
        message='Invaild OTP'
      }
    }else{
      message='Job is on hold or not started'
    }
     



  }
  

 
  


    
  return {message,status,data};
}




async function acceptJob(programmingLanguage){  
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`

  update tbl_assign_tech set current_status = 2 where assign_id=${programmingLanguage.body.assign_id} and current_status=0 and tech_id=${jwtResponse["id"]}


  `);
  const result = await db.query(
    `
    update tbl_assign_tech set current_status = 2 where assign_id=${programmingLanguage.body.assign_id} and current_status=0 and tech_id=${jwtResponse["id"]}

    `
  );

  console.log(`

  update  tbl_assign_tech set current_status=4 where cart_id = ${programmingLanguage.body.cart_id} and current_status = 0

`);
const result2 = await db.query(
  `
  update  tbl_assign_tech set current_status=4 where cart_id = ${programmingLanguage.body.cart_id} and current_status = 0
  `
);

console.log(`

update add_to_cart set cart_status= 5 where job_id =  ${programmingLanguage.body.cart_id}

`);
const result1 = await db.query(
`
update add_to_cart set cart_status= 5 where job_id =  ${programmingLanguage.body.cart_id}
`
);

console.log(`

select t1.user_id,t2.fcm_token,t2.name from add_to_cart t1 left join tbl_person t2 on t1.user_id=t2.user_id where t1.job_id='${programmingLanguage.body.cart_id}' GROUP BY t1.user_id,t2.fcm_token,t2.name


`);
const getToken = await db.query(
`
select t1.user_id,t2.fcm_token,t2.name from add_to_cart t1 left join tbl_person t2 on t1.user_id=t2.user_id where t1.job_id='${programmingLanguage.body.cart_id}' GROUP BY t1.user_id,t2.fcm_token,t2.name
`
);

if(getToken.length>0){
  console.log(helper.emptyOrRows(getToken)[0]["name"]);
  console.log(helper.emptyOrRows(getToken)[0]["fcm_token"]);
  
 message = {
  notification: {
  title: helper.emptyOrRows(getToken)[0]["name"],
  body: 'Your Job Approved',
  },
  token: helper.emptyOrRows(getToken)[0]["fcm_token"],
  };
    
  admin.messaging().send(message).then((response) => {
    console.log('Successfully sent message: ', response);
    })
    .catch((error) => {
    console.log('Error sending message: ', error);
    });


  message = 'Accect Job successfully';
  status=true;

}
    
  return {message,status,data};
}



async function setCancle(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  let data =[];
  if(!programmingLanguage.headers['authorization']){
    message="Enter authorization";
  }else if(!programmingLanguage.body.job_id){
    message="Enter Job Id";
  }else if(!programmingLanguage.body.cancle_msg){
    message="Enter Cart Msg";
  }else{
    var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  
  
  console.log(`
  update add_to_cart set cart_status=3 where job_id = ${programmingLanguage.body.job_id} and user_id=${jwtResponse["id"]}
  `);
    const result = await db.query(
      `
      update add_to_cart set cart_status=3 where job_id = ${programmingLanguage.body.job_id} and user_id=${jwtResponse["id"]}
      `
    );

    console.log(`
    insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.job_id}","${programmingLanguage.body.cancle_msg}","Cancle By User","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
    `);
      const insertresult = await db.query(
        `
        insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.job_id}","${programmingLanguage.body.cancle_msg}","Cancle By User","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
        `
      );
     
    if(insertresult.affectedRows){
      message = 'Cart Cancle successfully';
      status=true;
    
    }
  }
  

    
  return {message,status,data};
}




async function setTechCancle(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  if(!programmingLanguage.body.cart_id){
    message="Enter Cart Id";
  }else if(!programmingLanguage.body.cancle_msg){
    message="Enter Cart Msg";
  }else{
    
  console.log(`
  update tbl_assign_tech set current_status=8 where cart_id = ${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]}
  `);
    const result = await db.query(
      `
      update tbl_assign_tech set current_status=8 where cart_id = ${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]}
      `
    );
    if(result.affectedRows){
      console.log(`
        insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.cancle_msg}","Cancle By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
      `);
      const insertresult = await db.query(
        `
          insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.cancle_msg}","Cancle By Tech","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
        `
      );
    if(insertresult.affectedRows){
     
      message = 'Cart Cancle successfully';
      status=true;
    }
    
  
    }
  }
  

    
  return {message,status,data};
}


async function setTechStart(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  if(!programmingLanguage.body.cart_id){
    message="Enter Cart Id";
  }else if(!programmingLanguage.body.start_msg){
    message="Enter Cart Msg";
  }else if(!programmingLanguage.body.start_date){
    message="Enter start date";
  }else if(!programmingLanguage.body.start_time){
    message="Enter start time";
  }else if(!programmingLanguage.file){
    message="File Missing";
  }else{
    
    console.log(`
    SELECT * FROM tbl_assign_tech where current_status in(7,9) and tech_id =${jwtResponse["id"]}
  `);
    const result = await db.query(
      `
      SELECT * FROM tbl_assign_tech where current_status in(7,9) and tech_id =${jwtResponse["id"]}
      `
    );

    if(result.length<1){

      console.log(`
      update tbl_assign_tech set current_status=9 where cart_id = ${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]}
      `);
        const result = await db.query(
          `
          update tbl_assign_tech set current_status=9 where cart_id = ${programmingLanguage.body.cart_id} and tech_id=${jwtResponse["id"]}
          `
        );

        console.log(`
        insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,msg_image,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.start_msg}","Start By Tech","${programmingLanguage.file.filename}","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
      `);
      const insertresult = await db.query(
        `
          insert into tbl_job_msg(cart_job_id,cancle_msg,msg_type,msg_image,job_msg_date,job_msg_time,job_msg_lat_long) values("${programmingLanguage.body.cart_id}","${programmingLanguage.body.start_msg}","Start By Tech","${programmingLanguage.file.filename}","${programmingLanguage.body.job_msg_date}","${programmingLanguage.body.job_msg_time}","${programmingLanguage.body.job_msg_lat_long}")
        `
      );

      
      console.log(`
      insert into tbl_timeline(start_date,start_time,job_id) values("${programmingLanguage.body.start_date}","${programmingLanguage.body.start_time}","${programmingLanguage.body.cart_id}")
    `);
    const insertresult1 = await db.query(
      `
      insert into tbl_timeline(start_date,start_time,job_id) values("${programmingLanguage.body.start_date}","${programmingLanguage.body.start_time}","${programmingLanguage.body.cart_id}")
      `
    );
    if(insertresult.affectedRows){
         
          message = 'Cart Start job successfully';
          status=true;
    }
        


    }else{

        message="Already Started Job";

    }

  }
  

    
  return {message,status,data};
}


async function assignTech(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  let data =[];
  if(!programmingLanguage.body.cart_id){
    message="Enter Cart id";
  }else if(!programmingLanguage.body.schedule_date){
    message="Enter schedule date";
  } else if(!programmingLanguage.body.schedule_time){
    message="Enter schedule time";
  } else{
  console.log(programmingLanguage.body.tech);

  programmingLanguage.body.tech.forEach(async (element) => {
    console.log(element);

    console.log(`

    select * from tbl_person where user_id='${element}'


`);
const getToken = await db.query(
`
select * from tbl_person where user_id='${element}'

`
);

if(getToken.length>0){

  console.log(helper.emptyOrRows(getToken)[0]["name"]);
  console.log(helper.emptyOrRows(getToken)[0]["fcm_token"]);
  
  if(helper.emptyOrRows(getToken)[0]["fcm_token"]!=null){
    message = {
      notification: {
        title: helper.emptyOrRows(getToken)[0]["name"],
        body: 'You get a New Job',
      },
      token: helper.emptyOrRows(getToken)[0]["fcm_token"],
    };
  
    admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message: ', response);
      })
      .catch((error) => {
      console.log('Error sending message: ', error);
      });
  }


}

    console.log(`
    
    insert into tbl_assign_tech(cart_id,tech_id) values("${programmingLanguage.body.cart_id}","${element}")
    `);
      const insertresult = await db.query(
          `
          insert into tbl_assign_tech(cart_id,tech_id) values("${programmingLanguage.body.cart_id}","${element}")
          `
        );
      });

      console.log(`
    
      insert into tbl_cart_date_time(cart_id,schedule_date,schedule_time) values('${programmingLanguage.body.cart_id}','${programmingLanguage.body.schedule_date}','${programmingLanguage.body.schedule_time}')
      `);
        const insertTimeResult = await db.query(
          `
          insert into tbl_cart_date_time(cart_id,schedule_date,schedule_time) values('${programmingLanguage.body.cart_id}','${programmingLanguage.body.schedule_date}','${programmingLanguage.body.schedule_time}')
          `
        );

  console.log(`
    
  update add_to_cart set cart_status =4 where job_id=${programmingLanguage.body.cart_id}
  `);
    const insertresult = await db.query(
      `
      update add_to_cart set cart_status =4 where job_id=${programmingLanguage.body.cart_id}
      `
    );

  status =true;
  message="Assign Technician Successfully";
}
  return {message,status,data};
}





async function getOrderSummary(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  let data =[];
  
  console.log(`
  select t1.*,s_id,t2.sub_service_id,t2.service_name,(t2.price*t1.count) total_price,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price , round( t2.price-t2.price*t2.offer_per/100 ,2) as discount_price ,t2.offer_per from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
Left JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id
Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}
  `);
    const result = await db.query(
      `
      select t1.*,s_id,t2.sub_service_id,t2.service_name,(t2.price*t1.count) total_price,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price , round( t2.price-t2.price*t2.offer_per/100 ,2) as discount_price ,t2.offer_per from add_to_cart t1
LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
Left JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id
Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
where t1.cart_status=1 and t1.user_id=${jwtResponse["id"]}
      `
    );
    if(result.length>0){

      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}


async function getTechForCart(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
  
  
  let data =[];
  
  console.log(`
  SELECT  t1.user_id,t1.user_type as category_id,t2.name  FROM tbl_technician t1
  left join tbl_person t2 on t2.user_id = t1.user_id where t1.user_type ='${programmingLanguage.query.id}'
  `);
    const result = await db.query(
      `
      SELECT  t1.user_id,t1.user_type as category_id,t2.name  FROM tbl_technician t1
      left join tbl_person t2 on t2.user_id = t1.user_id where t1.user_type ='${programmingLanguage.query.id}'
      `
    );
    if(result.length>0){

      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}




async function getJobDeatils(programmingLanguage){
  
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`
  
  select t1. cart_status,t5.service_id as category_id,t1.start_time as schedule_time,t1.is_night,sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,
    sum(t4.price) as total_price,t1.service_date,t2.name,t2.mobile,t2.email,t3.user_location_type,t3.user_city,t3.user_house,t3.user_building,t3.user_landmark,t3.user_address,t3.user_lat_long,t2.name as paid_by,t6.cash_amt,t6.material_amt,t6.payment_status,t7.start_date,t7.start_time,t7.end_date,t7.end_time,t1.cart_status
    
    from add_to_cart t1
    left join tbl_person t2 on t1.user_id = t2.user_id
    left join tbl_location t3 on t1.address_id = t3.user_location_id
    left join tbl_service_detail t4 on t4.service_id = t1.service_id
    left join tbl_sub_service t5 on t5.sub_service_id = t4.sub_service_id
    left join tbl_payment_details t6 on t6.job_id = t1.job_id
    left join tbl_timeline t7 on t7.job_id = t1.job_id
    where t1.job_id=${programmingLanguage.query.id}
    group by t1. cart_status,t4.sub_service_id,t1.start_time,t1.is_night,t1.service_date,t2.name,t2.mobile,t2.email,t3.user_location_type,t3.user_city,t3.user_house,t3.user_building,t5.service_id ,t3.user_landmark,t3.user_address,t3.user_lat_long,t2.name,t6.cash_amt,t6.material_amt,t6.payment_status,t7.start_date,t7.start_time,t7.end_date,t7.end_time,t1.cart_status;
  `);
    const result = await db.query(
      `
      select t1. cart_status,t5.service_id as category_id,t1.start_time as schedule_time,t1.is_night,sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,
    sum(t4.price) as total_price,t1.service_date,t2.name,t2.mobile,t2.email,t3.user_location_type,t3.user_city,t3.user_house,t3.user_building,t3.user_landmark,t3.user_address,t3.user_lat_long,t2.name as paid_by,t6.cash_amt,t6.material_amt,t6.payment_status,t7.start_date,t7.start_time,t7.end_date,t7.end_time,t1.cart_status
    
    from add_to_cart t1
    left join tbl_person t2 on t1.user_id = t2.user_id
    left join tbl_location t3 on t1.address_id = t3.user_location_id
    left join tbl_service_detail t4 on t4.service_id = t1.service_id
    left join tbl_sub_service t5 on t5.sub_service_id = t4.sub_service_id
    left join tbl_payment_details t6 on t6.job_id = t1.job_id
    left join tbl_timeline t7 on t7.job_id = t1.job_id
    where t1.job_id=${programmingLanguage.query.id}
    group by t1. cart_status,t4.sub_service_id,t1.start_time,t1.is_night,t1.service_date,t2.name,t2.mobile,t2.email,t3.user_location_type,t3.user_city,t3.user_house,t3.user_building,t5.service_id ,t3.user_landmark,t3.user_address,t3.user_lat_long,t2.name,t6.cash_amt,t6.material_amt,t6.payment_status,t7.start_date,t7.start_time,t7.end_date,t7.end_time,t1.cart_status;
 
    `
    );
 
    if(result.length>0){

      message = 'get Job Details successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}


async function getTechJobDetails(programmingLanguage){
  
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  
  select t4.current_status,t2.name,t2.email,t2.mobile,t2.user_image,t1.job_id,t1.start_time,t1.service_date,t3.user_address,t3.user_lat_long from add_to_cart t1
      left join tbl_person t2 on t1.user_id = t2.user_id
      left join tbl_location t3 on t1.address_id = t3.user_location_id
      left join tbl_assign_tech t4 on t1.job_id = t4.cart_id
    where job_id=${programmingLanguage.query.id} and  t4.tech_id=${jwtResponse["id"]}
    group by t4.current_status,t2.name,t2.email,t2.mobile,t2.user_image,t1.job_id,t1.start_time,t1.service_date,t3.user_address,t3.user_lat_long;`);
    const result = await db.query(
      `select t4.current_status,t2.name,t2.email,t2.mobile,t2.user_image,t1.job_id,t1.start_time,t1.service_date,t3.user_address,t3.user_lat_long from add_to_cart t1
      left join tbl_person t2 on t1.user_id = t2.user_id
      left join tbl_location t3 on t1.address_id = t3.user_location_id
      left join tbl_assign_tech t4 on t1.job_id = t4.cart_id
      where job_id=${programmingLanguage.query.id} and  t4.tech_id=${jwtResponse["id"]}
      group by t4.current_status,t2.name,t2.email,t2.mobile,t2.user_image,t1.job_id,t1.start_time,t1.service_date,t3.user_address,t3.user_lat_long; `
    );
  
    console.log(`
  
    SELECT sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,t1.count,t4.service_name,sum(t4.price) as total_price FROM add_to_cart as t1 
    left join tbl_service_detail t4 on t4.service_id = t1.service_id
    WHERE job_id=${programmingLanguage.query.id}
    GROUP by count,t4.service_name
    `);
      const resultAddToCart = await db.query(
        `
        SELECT sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,t1.count,t4.service_name,sum(t4.price) as total_price FROM add_to_cart as t1 
        left join tbl_service_detail t4 on t4.service_id = t1.service_id
        WHERE job_id=${programmingLanguage.query.id}
        GROUP by count,t4.service_name  `
      );
  

    if(result.length>0){

      message = 'get Job Details successfully';
      status=true;
      data={
        "job_details":helper.emptyOrRows(result),
        "job_list":helper.emptyOrRows(resultAddToCart)
        
      };
    
  
    }

    
  return {message,status,data};
}



async function getCompletedJobDetails(programmingLanguage){
  
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  
  SELECT t2.name,t2.email,t2.mobile,t2.user_image,t2.user_id,t3.start_date,t3.start_time,t3.end_date,t3.end_time,t4.cash_amt,t4.material_amt from add_to_cart t1
left join tbl_person t2 on t1.user_id = t2.user_id
left join tbl_timeline t3 on t3.job_id = t1.job_id
left join tbl_payment_details t4 on t4.job_id = t1.job_id
where t1.job_id=${programmingLanguage.query.id}
GROUP by t2.name,t2.email,t2.mobile,t2.user_image,t2.user_id,t3.start_date,t3.start_time,t3.end_date,t3.end_time,t4.cash_amt,t4.material_amt`);
    const result = await db.query(
      `
      
  SELECT t2.name,t2.email,t2.mobile,t2.user_image,t2.user_id,t3.start_date,t3.start_time,t3.end_date,t3.end_time,t4.cash_amt,t4.material_amt from add_to_cart t1
  left join tbl_person t2 on t1.user_id = t2.user_id
  left join tbl_timeline t3 on t3.job_id = t1.job_id
  left join tbl_payment_details t4 on t4.job_id = t1.job_id
  where t1.job_id=${programmingLanguage.query.id}
  GROUP by t2.name,t2.email,t2.mobile,t2.user_image,t2.user_id,t3.start_date,t3.start_time,t3.end_date,t3.end_time,t4.cash_amt,t4.material_amt
      `
    );
  
    console.log(`
  
    SELECT sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,t1.count,t4.service_name,sum(t4.price) as total_price FROM add_to_cart as t1 
    left join tbl_service_detail t4 on t4.service_id = t1.service_id
    WHERE job_id=${programmingLanguage.query.id}
    GROUP by count,t4.service_name
    `);
      const resultAddToCart = await db.query(
        `
        SELECT sum(round( t4.price-t4.price*t4.offer_per/100 ,2)*count) as discount_total_price,t1.count,t4.service_name,sum(t4.price) as total_price FROM add_to_cart as t1 
        left join tbl_service_detail t4 on t4.service_id = t1.service_id
        WHERE job_id=${programmingLanguage.query.id}
        GROUP by count,t4.service_name  `
      );
  

    if(result.length>0){

      message = 'get Complete Job Details successfully';
      status=true;
      data={
        "job_details":helper.emptyOrRows(result),
        "job_list":helper.emptyOrRows(resultAddToCart)
        
      };
    
  
    }

    
  return {message,status,data};
}




async function getJobOrderDeatils(programmingLanguage){
  
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select t2.service_id,t2.service_name,t1.count,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price  from add_to_cart t1
  left join tbl_service_detail t2 on t2.service_id=t1.service_id
  where job_id=${programmingLanguage.query.id}
  `);
    const result = await db.query(
      `
      select t2.service_id,t2.service_name,t1.count,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price  from add_to_cart t1
      left join tbl_service_detail t2 on t2.service_id=t1.service_id
  where job_id=${programmingLanguage.query.id}
      `
    );
    if(result.length>0){

      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}




async function getAllTechDetails(programmingLanguage){
  
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`
  SELECT *,t2.name as dest_name FROM tbl_technician t1 left join tbl_service t2 on t1.user_type=t2.s_id left join tbl_person t3 on t3.user_id = t1.user_id where t1.user_id =${jwtResponse["id"]}

  `);
    const result = await db.query(
      `
      
      SELECT *,t2.name as dest_name FROM tbl_technician t1 left join tbl_service t2 on t1.user_type=t2.s_id left join tbl_person t3 on t3.user_id = t1.user_id where t1.user_id =${jwtResponse["id"]}
      `
    );
    if(result.length>0){

      message = 'Get Tect Details successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}




async function getOrderStatus(programmingLanguage){
  console.log(programmingLanguage.query);
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select t1.job_id,t1.is_night,t1.cart_id,t1.service_date,(t1.count*t2.price) total_price,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price,t1.cart_status,t2.service_name,t2.price,t1.count,t3.sub_service_name,round( t2.price-t2.price*t2.offer_per/100 ,2) as discount_price,t2.offer_per,t4.name as category_name  from  add_to_cart  t1
Left JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
Left JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id
Left JOIN tbl_service t4 ON t4.s_id = t3.service_id
WHERE t1.job_id =${programmingLanguage.query.job_id}
  `);
    const result = await db.query(
      `
      select t1.job_id,t1.is_night,t1.cart_id,t1.service_date,(t1.count*t2.price) total_price,round( t2.price-t2.price*t2.offer_per/100 ,2)*count as discount_total_price,t1.cart_status,t2.service_name,t2.price,t1.count,t3.sub_service_name,round( t2.price-t2.price*t2.offer_per/100 ,2) as discount_price,t2.offer_per,t4.name as category_name  from  add_to_cart  t1
      Left JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
      Left JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id
      Left JOIN tbl_service t4 ON t4.s_id = t3.service_id
      WHERE t1.job_id =${programmingLanguage.query.job_id} `
    );
    if(result.length>0){

      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
  
    }

    
  return {message,status,data};
}




async function addFeedback(programmingLanguage){
  console.log(programmingLanguage.body);
  let message = 'Something went wrong';
  let status =false;
 
  
  let data =[];
if(!programmingLanguage.headers['authorization']){
  message='Enter authorization';
}
  else if(!programmingLanguage.body.rating_value){
    message='Enter Rating value';
  }else if(!programmingLanguage.body.rating_msg){
    message='Enter Rating Message';
  }
  else if(!programmingLanguage.body.technician){
    message='Enter Technician value';
  }
  else if(!programmingLanguage.body.service_id){
    message='Enter Service Id';
  }else{
    try{
    var bearerHeader = programmingLanguage.headers['authorization'];
    jwtResponse=otp.verifyJwtToken(bearerHeader);
    console.log(`
    insert into tbl_rating(rating_value,rating_msg,user_id,technician,service_id) values(${programmingLanguage.body.rating_value},"${programmingLanguage.body.rating_msg}",${jwtResponse["id"]},${programmingLanguage.body.technician},${programmingLanguage.body.service_id})
    `);
      const result = await db.query(
        `
        insert into tbl_rating(rating_value,rating_msg,user_id,technician,service_id) values(${programmingLanguage.body.rating_value},"${programmingLanguage.body.rating_msg}",${jwtResponse["id"]},${programmingLanguage.body.technician},${programmingLanguage.body.service_id})
        `
      );
      if(result.affectedRows){
        // console.log(helper.emptyOrRows(result)[0]["user_id"]);
        message = 'Add Sub Services Department successfully';
        status=true;
    
      }
    }catch(err){
      message=err.message
    }
  }
 
    
  return {message,status,data};
}



async function getAddToCart(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select *,t1.service_id as main_service_id,round( t2.price-t2.price*t2.offer_per/100 ,2) as offer_price from add_to_cart t1 
JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id 
JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id 
JOIN tbl_service t4 ON t4.s_id = t3.service_id 
where user_id=${jwtResponse["id"]} and cart_status=1
  `);
    const result = await db.query(
      `
      select *,t1.service_id as main_service_id,round( t2.price-t2.price*t2.offer_per/100 ,2) as offer_price from add_to_cart t1 
JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id 
JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id 
JOIN tbl_service t4 ON t4.s_id = t3.service_id 
where user_id=${jwtResponse["id"]} and cart_status=1
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}





async function getClient(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select * from tbl_person where user_type='customer'
  `);
    const result = await db.query(
      `
      select * from tbl_person where user_type='customer'
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}





async function getClientDetail(req){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select * from tbl_person where user_type='customer'  and user_id=${req.query.id}
  `);
    const result = await db.query(
      `
      select * from tbl_person where user_type='customer'  and user_id=${req.query.id}
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}





async function getContact(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select * from app_contact
  `);
    const result = await db.query(
      `
      select * from app_contact
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add App Contact successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}


async function getMostBookServices(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  console.log(`
  
  select t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,s_id,round( price-price*offer_per/100 ,2)as offer_price,count(*) as rating_count ,AVG(rating_value) rating
  from tbl_service_detail t1
  Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
  Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
  Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
  where is_most_book_service =1
  group by t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,offer_price,s_id
 `);
    const result = await db.query(
      `
      select t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,s_id,round( price-price*offer_per/100 ,2)as offer_price,count(*) as rating_count ,AVG(rating_value) rating
      from tbl_service_detail t1
      Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
      Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
      Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
      where is_most_book_service =1
      group by t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,offer_price,s_id 
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}



async function getNotifiction(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  

  console.log(`
  select * from tbl_notification
  `);
    const result = await db.query(
      `select * from tbl_notification
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Get Notification successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
    }  
  return {message,status,data};
}

async function getOfferService(){
  let message = 'No Offer Service Found';
  let status =false;
  
  let data =[];

  console.log(`
  
  select t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,s_id,round( price-price*offer_per/100 ,2)as offer_price,count(*) as rating_count ,AVG(rating_value) rating
  from tbl_service_detail t1
  Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
  Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
  Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
  where is_offer =1
  group by t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,offer_price,s_id  `);
    const result = await db.query(
      `
      select t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,s_id,round( price-price*offer_per/100 ,2)as offer_price,count(*) as rating_count ,AVG(rating_value) rating
      from tbl_service_detail t1
      Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
      Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
      Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
      where is_offer =1
      group by t1.service_id,service_name,price,short_desc,full_desc,t1.image,is_offer,offer_per,offer_price,s_id     `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'get Offer Service successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}



async function getServicesList(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.service_id,t1.sub_service_id,t1.full_desc,t1.service_name,t1.price,t1.short_desc,s_id,t1.image,AVG(rating_value) rating,count(rating_value) rating_count,is_add_to_cart(${jwtResponse["id"]},t1.service_id) as is_add_to_cart,offer_per,round( t1.price-t1.price*t1.offer_per/100 ,2) as offer_price from tbl_service_detail t1
Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
where t1.sub_service_id=${programmingLanguage.query.id}
Group by t1.service_id,t1.sub_service_id,t1.full_desc,t1.service_name,t1.price,t1.short_desc,t1.image,is_add_to_cart,offer_per,offer_price,s_id
  `);
    const result = await db.query(
      `
      select t1.service_id,t1.sub_service_id,t1.full_desc,t1.service_name,t1.price,t1.short_desc,s_id,t1.image,AVG(rating_value) rating,count(rating_value) rating_count,is_add_to_cart(${jwtResponse["id"]},t1.service_id) as is_add_to_cart,offer_per,round( t1.price-t1.price*t1.offer_per/100 ,2) as offer_price from tbl_service_detail t1
Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
Left JOIN tbl_sub_service t3 ON t1.sub_service_id = t3.sub_service_id
Left JOIN tbl_service t4 ON t3.service_id = t4.s_id
where t1.sub_service_id=${programmingLanguage.query.id}
Group by t1.service_id,t1.sub_service_id,t1.full_desc,t1.service_name,t1.price,t1.short_desc,t1.image,is_add_to_cart,offer_per,offer_price,s_id
 `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}


async function getSearch(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.service_id,t1.full_desc,t1.service_name,t1.sub_service_id,is_offer,t1.offer_per,round( t1.price-t1.price*t1.offer_per/100 ,2) as offer_price,t1.price,t1.short_desc,t1.image,AVG(rating_value) rating,count(rating_value) rating_count,is_add_to_cart(${jwtResponse["id"]},t1.service_id) as is_add_to_cart from tbl_service_detail t1
  Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
  where t1.service_name like "%${programmingLanguage.query.search}%"
  Group by t1.service_id,t1.full_desc,t1.service_name,t1.sub_service_id,t1.price,t1.offer_per,t1.short_desc,t1.image,is_add_to_cart,offer_price,is_offer
   `);
    const result = await db.query(
      `
      select t1.service_id,t1.full_desc,t1.service_name,t1.sub_service_id,is_offer,t1.offer_per,round( t1.price-t1.price*t1.offer_per/100 ,2) as offer_price,t1.price,t1.short_desc,t1.image,AVG(rating_value) rating,count(rating_value) rating_count,is_add_to_cart(${jwtResponse["id"]},t1.service_id) as is_add_to_cart from tbl_service_detail t1
  Left JOIN tbl_rating t2 ON t1.service_id = t2.service_id
  where t1.service_name like "%${programmingLanguage.query.search}%"
  Group by t1.service_id,t1.full_desc,t1.service_name,t1.sub_service_id,t1.price,t1.offer_per,t1.short_desc,t1.image,is_add_to_cart,offer_price,is_offer
    `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Get Searcht successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data Found';
        status=true;
      }
     
  
    
  return {message,status,data};
}


async function getServicesAdminList(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`
  select * from tbl_service_detail where sub_service_id=${programmingLanguage.query.id}
  
  `);
    const result = await db.query(
      `
      select * from tbl_service_detail where sub_service_id=${programmingLanguage.query.id}
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}



async function getPendingAction(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  if(!programmingLanguage.headers['authorization']){
    message='Enter authorization';
  }else{
    try{
      var bearerHeader = programmingLanguage.headers['authorization'];
      jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`
  select assign_id,user_image,name,t1.cart_id,start_time,service_date,t4.user_address from tbl_assign_tech t1
  Left JOIN add_to_cart t2 ON t1.cart_id = t2.job_id
  Left JOIN tbl_person t3 ON t3.user_id = t2.user_id
  Left JOIN tbl_location t4 ON t4.user_location_id = t2.address_id

where current_status=0 and tech_id=${jwtResponse["id"]}
group by  assign_id,user_image,name,t1.cart_id,start_time,service_date,t4.user_address
  `);
    const result = await db.query(
      `
      select assign_id,user_image,name,t1.cart_id,start_time,service_date,t4.user_address from tbl_assign_tech t1
      Left JOIN add_to_cart t2 ON t1.cart_id = t2.job_id
      Left JOIN tbl_person t3 ON t3.user_id = t2.user_id
      Left JOIN tbl_location t4 ON t4.user_location_id = t2.address_id
    
    where current_status=0 and tech_id=${jwtResponse["id"]}
    group by  assign_id,user_image,name,t1.cart_id,start_time,service_date,t4.user_address
      `
    );
    
    if(result.length>0){
     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
      status=true;
      }
    }catch(err){
      message=err.message
    }
     
    }
    
  return {message,status,data};
}



async function getOnGoingJob(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  if(!programmingLanguage.headers['authorization']){
    message='Enter authorization';
  }else{
    try{
      var bearerHeader = programmingLanguage.headers['authorization'];
      jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`
      select t1.current_status,t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id as job_id from tbl_assign_tech t1 
      left join add_to_cart t2 on t2.job_id=t1.cart_id
      left join tbl_person t3 on t3.user_id=t2.user_id
      left join tbl_location t4 on t4.user_location_id = t2.address_id
      
      where tech_id=${jwtResponse["id"]} and  t1.current_status in (2,5,7,6,8,9)
      group by t1.current_status,t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id;
  
  `);
    const result = await db.query(
      `
      select t1.current_status,t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id as job_id from tbl_assign_tech t1 
      left join add_to_cart t2 on t2.job_id=t1.cart_id
      left join tbl_person t3 on t3.user_id=t2.user_id
      left join tbl_location t4 on t4.user_location_id = t2.address_id
      
      where  tech_id=${jwtResponse["id"]}  and  t1.current_status in (2,5,7,6,8,9)
      group by t1.current_status,t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id;
      `
    );
    
    if(result.length>0){
     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
        status=true;
      }
    }catch(err){
      message=err.message
    }
     
    }
    
  return {message,status,data};
}


async function getCompletedTechJob(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  if(!programmingLanguage.headers['authorization']){
    message='Enter authorization';
  }else{
    try{
      var bearerHeader = programmingLanguage.headers['authorization'];
      jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`
      select t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id as job_id from tbl_assign_tech t1 
      left join add_to_cart t2 on t2.job_id=t1.cart_id
      left join tbl_person t3 on t3.user_id=t2.user_id
      left join tbl_location t4 on t4.user_location_id = t2.address_id
      
      where tech_id=${jwtResponse["id"]} and t1.current_status =1
      group by t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id;
  
  `);
    const result = await db.query(
      `
      select t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id as job_id from tbl_assign_tech t1 
      left join add_to_cart t2 on t2.job_id=t1.cart_id
      left join tbl_person t3 on t3.user_id=t2.user_id
      left join tbl_location t4 on t4.user_location_id = t2.address_id
      
      where tech_id=${jwtResponse["id"]} and t1.current_status =1
      group by t3.name,t3.user_image,t2.job_id,t2.service_date,t2.start_time,t4.user_address,t1.cart_id;
      `
    );
    
    if(result.length>0){
     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
        status=true;
      }
    }catch(err){
      message=err.message
    }
     
    }
    
  return {message,status,data};
}




async function getVerifyTechJob(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];

  if(!programmingLanguage.headers['authorization']){
    message='Enter authorization';
  }else{
    try{
      var bearerHeader = programmingLanguage.headers['authorization'];
      jwtResponse=otp.verifyJwtToken(bearerHeader);
  console.log(`
  SELECT t3.service_date,t2.cash_amt,t2.material_amt,t2.job_id FROM tbl_assign_tech t1
  left join tbl_payment_details t2 on t2.job_id = t1.cart_id
  left join add_to_cart t3 on t3.job_id = t1.cart_id
  
  where t1.current_status =11 and tech_id=${jwtResponse["id"]}
  GROUP by  t3.service_date,t2.cash_amt,t2.material_amt,t2.job_id
  
  `);
    const result = await db.query(
      `
      SELECT t3.service_date,t2.cash_amt,t2.material_amt,t2.job_id FROM tbl_assign_tech t1
      left join tbl_payment_details t2 on t2.job_id = t1.cart_id
      left join add_to_cart t3 on t3.job_id = t1.cart_id
      
      where t1.current_status =11 and tech_id=${jwtResponse["id"]}
      GROUP by  t3.service_date,t2.cash_amt,t2.material_amt,t2.job_id
      `
    );
    
    if(result.length>0){
     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
        status=true;
      }
    }catch(err){
      message=err.message
    }
     
    }
    
  return {message,status,data};
}



async function getClientAddress(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  
  console.log(`
  select * from tbl_location where user_id='${programmingLanguage.query.id}'
  `);
    const result = await db.query(
      `
      select * from tbl_location where user_id='${programmingLanguage.query.id}'
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}


async function getTotalAddToCart(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
    select sum(price*count) total_price ,count(*) number_of_item ,t2.sub_service_id,t3.sub_service_name,t4.name,t4.s_id from add_to_cart t1
    JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
    JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id
    JOIN tbl_service t4 ON t3.service_id = t4.s_id
    where user_id=${jwtResponse["id"]} and cart_status=1 group by sub_service_id,t3.sub_service_name,t4.name,t4.s_id
  `);
    const result = await db.query(
      `
      select sum(price*count) total_price ,count(*) number_of_item ,t2.sub_service_id,t3.sub_service_name,t4.name,t4.s_id from add_to_cart t1
    JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
    JOIN tbl_sub_service t3 ON t3.sub_service_id = t2.sub_service_id
    JOIN tbl_service t4 ON t3.service_id = t4.s_id
    where user_id=${jwtResponse["id"]} and cart_status=1 group by sub_service_id,t3.sub_service_name,t4.name,t4.s_id


      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
    }else{
      message = 'No Data Found';
      status=true;
    }
  return {message,status,data};
}

async function getUpcoming(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.user_id,t1.start_time,service_date, sum(price*count) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)*count) as discount_total_price ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long,is_night,t6.current_status from add_to_cart t1 LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_assign_tech t6 ON t6.cart_id = t1.job_id where t1.user_id=${jwtResponse["id"]} and cart_status in (2,4,5) group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status,is_night,t6.current_status order by t1.job_id DESC;


  `);
    const result = await db.query(
      `
      select t1.user_id,t1.start_time,service_date, sum(price*count) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)*count) as discount_total_price ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long,is_night,t6.current_status from add_to_cart t1 LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_assign_tech t6 ON t6.cart_id = t1.job_id where t1.user_id=${jwtResponse["id"]} and cart_status in (2,4,5) group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status,is_night,t6.current_status order by t1.job_id DESC;
      `
    );
    
    if(result.length>0){
      message = 'Get Upcoming List successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
        status=true;
      }
  return {message,status,data};
}


async function getCompleted(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.user_id,t1.start_time,service_date, sum(price*count) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)*count) as discount_total_price  ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long from add_to_cart t1
LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id
 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
where t1.user_id=${jwtResponse["id"]} and cart_status=10
group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status
order by t1.job_id DESC

  `);
    const result = await db.query(
      `
      select t1.user_id,t1.start_time,service_date, sum(price*count) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)*count) as discount_total_price  ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long from add_to_cart t1
      LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id
       LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
      where t1.user_id=${jwtResponse["id"]} and cart_status=10
      group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status
      order by t1.job_id DESC

      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Get Upcoming List successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data found';
        status=true;
      }
     
  
    
  return {message,status,data};
}


async function getMyBooking(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.user_id,t1.job_id,t1.service_date,t1.start_time,sum(price*count) as total_price,cart_status,is_night from add_to_cart t1
LEFT JOIN tbl_service_detail t3 ON t1.service_id = t3.service_id
where t1.cart_status!=1 and t1.user_id=${jwtResponse["id"]}
group by t1.user_id,t1.job_id,t1.service_date,t1.start_time,cart_status,is_night
  `);
    const result = await db.query(
      `
      select t1.user_id,t1.job_id,t1.service_date,t1.start_time,sum(price*count) as total_price,cart_status,is_night from add_to_cart t1
LEFT JOIN tbl_service_detail t3 ON t1.service_id = t3.service_id
where t1.cart_status!=1 and t1.user_id=${jwtResponse["id"]}
group by t1.user_id,t1.job_id,t1.service_date,t1.start_time,cart_status,is_night
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}



async function getJob(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`
  select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.complete_otp,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('2','3','4','5') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.complete_otp,t6.verify_otp order by t1.job_id DESC
  `);
    const result = await db.query(
      `
      select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.complete_otp,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('2','3','4','5') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.complete_otp,t6.verify_otp order by t1.job_id DESC
     
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}



async function getNonVerifyJobs(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`
  select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('10') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.verify_otp order by t1.job_id DESC;

  `);
    const result = await db.query(
      `
      select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('10') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.verify_otp order by t1.job_id DESC;

     
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}


async function getVerifyAdminJobs(){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  console.log(`
  select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('11') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.verify_otp order by t1.job_id DESC;

  `);
    const result = await db.query(
      `
      select t1.job_id,t1.service_date,t4.name as category_name,cart_status,t5.name as user_name,t5.mobile,t6.verify_otp from add_to_cart t1 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id LEFT JOIN tbl_sub_service t3 ON t2.sub_service_id = t3.sub_service_id LEFT JOIN tbl_service t4 ON t4.s_id = t3.service_id LEFT JOIN tbl_person t5 ON t5.user_id = t1.user_id LEFT JOIN tbl_timeline t6 ON t6.job_id = t1.job_id where cart_status in ('11') group by t1.job_id,t1.service_date,t4.name,t5.name,t1.cart_status,t5.mobile,t6.verify_otp order by t1.job_id DESC;

     
      `
    );
    
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

     
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }
     
  
    
  return {message,status,data};
}




async function getCancle(programmingLanguage){
  let message = 'Something went wrong';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`
  select t1.user_id,t1.start_time,service_date, sum(price) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)) as discount_total_price ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long,is_night from add_to_cart t1
LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id
 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
  where t1.user_id=${jwtResponse["id"]} and cart_status=3
  group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status,is_night
  order by t1.service_date DESC
  `);
    const result = await db.query(
      `
      select t1.user_id,t1.start_time,service_date, sum(price) as total_price,sum(round( t2.price-t2.price*t2.offer_per/100 ,2)) as discount_total_price ,t1.address_id,cart_status,t1.job_id,user_name,user_mobile,user_address,user_lat_long,is_night from add_to_cart t1
LEFT JOIN tbl_location t3 ON t3.user_location_id = t1.address_id
 LEFT JOIN tbl_service_detail t2 ON t1.service_id = t2.service_id
  where t1.user_id=${jwtResponse["id"]} and cart_status=3
  group by t1.user_id,t1.start_time,service_date,t1.address_id,t1.job_id,user_name,user_mobile,user_address,user_lat_long,cart_status,is_night
  order by t1.service_date DESC`
    );
    
    if(result.length>0){
      
      message = 'Add Sub Services Department successfully';
      status=true;
      data=helper.emptyOrRows(result);
    
      }else{
        message = 'No Data Found';
        status=true;
        data=[];
      
      }
     
  
    
  return {message,status,data};
}


async function getBanner(req){
  let message = 'No Banner Found';
  let status =false;
  
  let data =[];
  if(req.query.id){
    console.log(`select * from tbl_banner where banner_id  = ${req.query.id}
`);
    const result = await db.query(
      `select * from tbl_banner where banner_id  = ${req.query.id}
 `
    );
    console.log(result);
    if(result.length>=1){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Banner successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }
  }else{
    console.log(`select * from tbl_banner`);
    const result = await db.query(
      `select * from tbl_banner`
    );
    console.log(result);
    if(result.length>=1){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Banner successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }
  }
  
  

    
  return {message,status,data};
}


async function getCartInfo(req){
  let message = 'No Messgae Found';
  let status =false;
  
  let data =[];
  
  console.log(`SELECT * FROM tbl_job_msg t1 left JOIN tbl_payment_details t2 on t2.job_id=t1.cart_job_id WHERE cart_job_id=${req.query.id}`);
    const result = await db.query(
      `SELECT * FROM tbl_job_msg t1 left JOIN tbl_payment_details t2 on t2.job_id=t1.cart_job_id WHERE cart_job_id=${req.query.id}`
    );
    console.log(result);
    if(result.length>0){

      message = 'Get Job Message successfully';
      status=true;
      data =helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function getSubServices(){
  let message = 'No Sub Services Found';
  let status =false;
  
  let data =[];
  
  console.log(`select sub_service_id,sub_service_name,name,image from tbl_sub_service t1 LEFT JOIN tbl_service t2 ON t1.service_id=t2.s_id`);
    const result = await db.query(
      `select sub_service_id,sub_service_name,name,image from tbl_sub_service t1 LEFT JOIN tbl_service t2 ON t1.service_id=t2.s_id`
    );
    // console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Sub Services successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}

async function getSubServicesById(req){
  let message = 'No Sub Services Found';
  let status =false;
  
  let data =[];
  
  console.log(`select sub_service_id,sub_service_name,name,image,s_id from tbl_sub_service t1 LEFT JOIN tbl_service t2 ON t1.service_id=t2.s_id where sub_service_id = ${req.query.id}`);
    const result = await db.query(
      `select sub_service_id,sub_service_name,name,image,s_id from tbl_sub_service t1 LEFT JOIN tbl_service t2 ON t1.service_id=t2.s_id where sub_service_id = ${req.query.id}`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Sub Services successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function getEmplyoee(){
  let message = 'No Sub Services Found';
  let status =false;
  
  let data =[];
  
  console.log(`select * from tbl_person t1
LEFT JOIN tbl_technician t2 ON t1.user_id = t2.user_id

LEFT JOIN tbl_service t3 ON t3.s_id = t2.user_type
where t1.user_type='technician'
`);
    const result = await db.query(
      `select * from tbl_person t1
LEFT JOIN tbl_technician t2 ON t1.user_id = t2.user_id
LEFT JOIN tbl_service t3 ON t3.s_id = t2.user_type
where t1.user_type='technician'
`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Sub Services successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function getAllServiceDetails(req){
  let message = 'No Sub Services Found';
  let status =false;
  
  let data =[];
  if(req.query.id){
    console.log(`
    select  t1.is_most_book_service ,t1.sub_service_id,t2.service_id as category_id,t1.service_id,t1.service_name,t1.price,t1.short_desc,t1.full_desc,t1.image,t2.sub_service_name,t3.name,t1.offer_per   from tbl_service_detail t1
LEFT JOIN tbl_sub_service t2 ON t1.sub_service_id = t2.sub_service_id
LEFT JOIN tbl_service t3 ON t2.service_id = t3.s_id
      where t1.service_id = ${req.query.id}
      
    `);
      const result = await db.query(
        `
        select  t1.is_most_book_service ,t1.sub_service_id,t2.service_id as category_id,t1.service_id,t1.service_name,t1.price,t1.short_desc,t1.full_desc,t1.image,t2.sub_service_name,t3.name,t1.offer_per   from tbl_service_detail t1
          LEFT JOIN tbl_sub_service t2 ON t1.sub_service_id = t2.sub_service_id
LEFT JOIN tbl_service t3 ON t2.service_id = t3.s_id
          where t1.service_id = ${req.query.id}
          `
      );
      if(result.length>0){
        // console.log(helper.emptyOrRows(result)[0]["user_id"]);
        message = 'Get Sub Services successfully';
        status=true;
        data = helper.emptyOrRows(result);
      }
  }else{
    console.log(`
    select t1.sub_service_id,t1.service_id,t1.service_name,t1.price,t1.short_desc,t1.full_desc,t1.image,t2.sub_service_name,t3.name,t1.offer_per   from tbl_service_detail t1
      LEFT JOIN tbl_sub_service t2 ON t1.sub_service_id = t2.sub_service_id
      LEFT JOIN tbl_service t3 ON t2.service_id = t3.s_id
      
    `);
      const result = await db.query(
        `
        select t1.sub_service_id,t1.service_id,t1.service_name,t1.price,t1.short_desc,t1.full_desc,t1.image,t2.sub_service_name,t3.name ,t1.offer_per  from tbl_service_detail t1
          LEFT JOIN tbl_sub_service t2 ON t1.sub_service_id = t2.sub_service_id
          LEFT JOIN tbl_service t3 ON t2.service_id = t3.s_id
          `
      );
      if(result.length>0){
        // console.log(helper.emptyOrRows(result)[0]["user_id"]);
        message = 'Get Sub Services successfully';
        status=true;
        data = helper.emptyOrRows(result);
      }
  }
  


    
  return {message,status,data};
}



async function getServicesDepartment(req){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  
  if(req.query.id){
    console.log(`select * from tbl_service where s_id=${req.query.id}`);
    const result = await db.query(
      `select * from tbl_service where s_id=${req.query.id}`
    );
    console.log(result);
    if(result.length>=1){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  }else{
    console.log(`select * from tbl_service`);
    const result = await db.query(
      `select * from tbl_service`
    );
    console.log(result);
    if(result.length>=1){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  }

  return {message,status,data};
}


async function getSubServicesFilter(req){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  
  console.log(`select * from tbl_sub_service where service_id=${req.query.id}`);
    const result = await db.query(
      `select * from tbl_sub_service where service_id=${req.query.id}`
    );
    // console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}



async function getTechnicianDetailsinCart(req){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  
  console.log(`SELECT * FROM tbl_assign_tech t1
  left join tbl_technician t2 on t1.tech_id=t2.user_id
  WHERE  current_status not in (0,4,8) and t1.cart_id=${req.query.id}`);
    const result = await db.query(
      `SELECT * FROM tbl_assign_tech t1
      left join tbl_technician t2 on t1.tech_id=t2.user_id
      WHERE  current_status not in (0,4,8) and t1.cart_id=${req.query.id}`
    );
    // console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function addTechnician(req){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  let generateOTP=otp.generateOTP();

  console.log(`insert into tbl_person (email,name,mobile,otp,user_type)
  values ("${req.body.email}","${req.body.name}","${req.body.mobile}","${generateOTP},'technician'");
   `);
    const result = await db.query(
    `
    insert into tbl_person (email,name,mobile,otp,user_type)
    values ("${req.body.email}","${req.body.name}","${req.body.mobile}","${generateOTP}",'technician')
    `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

      const result1 = await db.query(
        `
        insert into tbl_technician(user_id, user_type,user_photo,user_guardian_name,user_guardian_number,user_city,user_state,user_country,user_pan_card,user_salary,user_adhar_card,user_address,user_is_active,	blood_group,user_dob)
        values(${result.insertId},"${req.body.user_type}","${req.files.user_photo[0].filename}","${req.body.user_guardian_name}","${req.body.user_guardian_number}","${req.body.user_city}","${req.body.user_state}","${req.body.user_country}","${req.body.user_pan_card}","${req.body.user_salary}","${req.files.aadhar[0].filename}","${req.body.user_address}","${req.body.user_is_active}","${req.body.blood_group}","${req.body.user_dob}")
        
        `
      );
      console.log(result1);
      message = 'Get Services Department successfully';
      status=true;
      data = [];
    }

    
  return {message,status,data};
}


async function addThought(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];

  console.log(programmingLanguage['thought-file'][0].filename);
  console.log(programmingLanguage['thought-video'][0].filename);

  console.log(`
  insert into tbl_thought(thought_name,thought_image,thought_video_url) values('${programmingLanguage['thought-file'][0].filename}','${programmingLanguage['thought-file'][0].filename}','${programmingLanguage['thought-video'][0].filename}')
  `);
    const result = await db.query(
    `
    insert into tbl_thought(thought_name,thought_image,thought_video_url) values('${programmingLanguage['thought-file'][0].filename}','${programmingLanguage['thought-file'][0].filename}','${programmingLanguage['thought-video'][0].filename}')
    `
    );
    if(result.affectedRows){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);

      message = 'Get Services Department successfully';
      status=true;
      data = [];
    }

    
  return {message,status,data};
}

async function getLocation(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from tbl_location where user_id =${jwtResponse["id"]}`);
    const result = await db.query(
      `select * from tbl_location where user_id =${jwtResponse["id"]}`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function getThought(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];

  if(programmingLanguage.query.id){
    console.log(`select * from tbl_thought where thought_id =${programmingLanguage.query.id}`);
    const result = await db.query(
      `select * from tbl_thought where thought_id =${programmingLanguage.query.id}`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }
  }else{
  
    console.log(`select * from tbl_thought`);
    const result = await db.query(
      `select * from tbl_thought`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

  }

    
  return {message,status,data};
}

async function getTechnician(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from tbl_technician where user_id =${jwtResponse["id"]}`);
    const result = await db.query(
      `select * from tbl_technician where user_id =${jwtResponse["id"]}`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}



async function getProfile(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from tbl_person where user_id =${jwtResponse["id"]}`);
    const result = await db.query(
      `select * from tbl_person where user_id =${jwtResponse["id"]}`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get Services Department successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function getClientDetails(programmingLanguage){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  var bearerHeader = programmingLanguage.headers['authorization'];
  jwtResponse=otp.verifyJwtToken(bearerHeader);
  
  console.log(`select * from tbl_person where user_id ='${programmingLanguage.query.id}'`);
    const result = await db.query(
      `select * from tbl_person where user_id ='${programmingLanguage.query.id}'`
    );
    console.log(result);
    if(result.length>0){
      // console.log(helper.emptyOrRows(result)[0]["user_id"]);
      message = 'Get User Details successfully';
      status=true;
      data = helper.emptyOrRows(result);
    }

    
  return {message,status,data};
}


async function checkAuth(req){
  let message = 'No Services Department Found';
  let status =false;
  
  let data =[];
  
  var bearerHeader = req.headers['authorization'];
  

  data=otp.verifyJwtToken(bearerHeader);
  console.log(data);
  console.log(data["id"]);
  console.log(data["user_type"]);
  
  return {message,status,data};
}



module.exports = {
  getMultiple,
  login,
  signup,
  verifyOTP,
  addBanner,
  getBanner,
  addServicesDepartment,
  getServicesDepartment,
  deleteBanner,
  addSubServices,
  getTechForCart,
  getSubServices,
  addServiceDetail,
  checkAuth,
  addCount,
  getAddToCart,
  addLocation,
  editLocation,
  getLocation,
  placeOrder,
  getUpcoming,
  addTechnician,
  addPuchIn,
  addPuchOut,
  getTotalAddToCart,
  setCancle,
  getOfferService,
  getCancle,
  addFeedback,
  getServicesList,
  getMostBookServices,
  getTechJobHistory,
  removeCount,
  getProfile,
  getCartInfo,
  getSubServicesFilter,
  getOrderSummary,
  getMyBooking,
  editProfile,
  addThought,
  getThought,
  getAllServiceDetails,
  getServicesAdminList,
  getJob,
  getClient,
  getContact,
  addJob,
  addClient,
  getNotifiction,
  getClientAddress,
  getEmplyoee,
  getTechnician,
  removeCountOrder,
  changeImage,
  assignTech,
  getPendingAction,
  rejectJob,
  acceptJob,
  getJobOrderDeatils,
  deleteLocation,
  getSearch,
  getOnGoingJob,
  getOrderStatus,
  setOntheWay,
  setHoldJob,
  addAppFeedback,
  setTechCancle,
  getJobDeatils,
  newToken,
  editBanner,
  editServicesDepartment,
  addCountOrder,
  setPin,
  setMostBookService,
  deleteSubService,
  setTechStart,
  setResumeJob,
  editThought,
  getTechnicianDetailsinCart,
  sendCompleteOTP,
  editSubService,
  getNonVerifyJobs,
  getAllTechDetails,
  getVerifyTechJob,
  getCompletedTechJob,
  getCompletedJobDetails,
  setVerfityJob,
  editPersonDetails,
  setCompleteJob,
  deleteServiceDept,
  getClientDetails,
  editServiceDetails,
  getSubServicesById,
  setOfferService,
  getCompleted,
  getClientDetail,
  getVerifyAdminJobs,
  deleteThought,
  deleteEmp,
  getTechJobDetails,
  sendNotification,
  addLocationAdmin,
  deleteServiceDetails,
  deleteUser
}