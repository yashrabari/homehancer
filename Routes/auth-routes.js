const express = require('express');
const multer  = require('multer');
const router = express.Router();
const programmingLanguages = require('../Config/services/auth-service');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
var upload = multer({ storage: storage });

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getMultiple());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/notification', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.sendNotification(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});
router.get('/getAllServiceDetails', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getAllServiceDetails(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/login', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.login(req.body));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

router.post('/setVerfityJob', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.setVerfityJob(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});



router.get('/getVerifyTechJob', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getVerifyTechJob(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});



router.get('/getAllTechDetails', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getAllTechDetails(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});


router.post('/sendCompleteOTP', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.sendCompleteOTP(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

// router.post('/sendVerifyOTP', async function(req, res, next) {
//   try {
//     res.json(await programmingLanguages.sendVerifyOTP(req));
//   } catch (err) {
//     console.error(`Error while creating programming language`, err.message);
//     next(err);
//   }
// });

router.post('/signup',upload.single('user-file'), async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.signup(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

router.post('/editProfile',upload.single('user-file'), async function(req, res, next) {
  try {
    res.json(await programmingLanguages.editProfile(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

router.post('/verifyOTP', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.verifyOTP(req.body));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});


router.post('/add-banner', upload.single('banner-file'),async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.addBanner(req.file));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/edit-banner', upload.single('banner-file'),async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.editBanner(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/edit-sub-service',async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.editSubService(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/edit-thought',  upload.fields([
  { name: 'thought-file', maxCount: 1},
  { name: 'thought-video', maxCount: 1}
  ]),async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.editThought(req.files,req.body.id));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/change-image', upload.single('user-image'),async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.changeImage(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-client', upload.single('user-file'),async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    res.json(await programmingLanguages.addClient(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})




router.post('/add-thought',  upload.fields([
  { name: 'thought-file', maxCount: 1},
  { name: 'thought-video', maxCount: 1}
  ]),async function (req, res, next) {
  

  try {
    res.json(await programmingLanguages.addThought(req.files));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/add-services-department', upload.single('services-department-file'),async function (req, res, next) {
  // req.file is the `services-department-file` file
  // req.body will hold the text fields, if there were any
  
  
  try {
    res.json(await programmingLanguages.addServicesDepartment(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/edit-services-department', upload.single('services-department-file'),async function (req, res, next) {

  try {
    res.json(await programmingLanguages.editServicesDepartment(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-to-cart',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.addCount(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/add-to-cart-order',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.addCountOrder(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/removeCount',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.removeCount(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/removeCountOrder',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.removeCountOrder(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/add-services-detail', upload.single('services-detail-file'),async function (req, res, next) {
  // req.file is the `services-department-file` file
  // req.body will hold the text fields, if there were any
  
  
  try {
    res.json(await programmingLanguages.addServiceDetail(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})



router.post('/edit-services-detail', upload.single('services-detail-file'),async function (req, res, next) {

  try {
    res.json(await programmingLanguages.editServiceDetails(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/setTechStart', upload.single('start-job-file'),async function (req, res, next) {

  try {
    res.json(await programmingLanguages.setTechStart(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})



router.post('/setMostBookService',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.setMostBookService(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})



router.post('/setOfferService',async function (req, res, next) {

  try {
    res.json(await programmingLanguages.setOfferService(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-punch-out', upload.single('punch-out-file'),async function (req, res, next) {
  // req.file is the `services-department-file` file
  // req.body will hold the text fields, if there were any
  
  
  try {
    res.json(await programmingLanguages.addPuchOut(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})






router.post('/add-technician',upload.fields([{
  name: 'aadhar', maxCount: 1
}, {
  name: 'user_photo', maxCount: 1
}]),async function (req, res, next) {
  // req.file is the `services-department-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    
    
  
    res.json(await programmingLanguages.addTechnician(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})




router.post('/setCompleteJob',upload.fields([{
  name: 'bill-image', maxCount: 1
}, {
  name: 'work-image', maxCount: 1
}]),async function (req, res, next) {
  // req.file is the `services-department-file` file
  // req.body will hold the text fields, if there were any
  
  try {
    
    
  
    res.json(await programmingLanguages.setCompleteJob(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/add-sub-services', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.addSubServices(req.body));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.post('/add-sub-services', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.addSubServices(req.body));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.get('/deleteEmp', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.deleteEmp(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})


router.get('/deleteEmp', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.deleteEmp(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-location', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.addLocation(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-location-admin', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.addLocationAdmin(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/edit-location', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.editLocation(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.post('/add-punchIn', async function (req, res, next) {
  
  try {
    res.json(await programmingLanguages.addPuchIn(req));
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
})

router.get('/get-banner', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getBanner(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getCompletedJobDetails', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getCompletedJobDetails(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getMonthlyReport', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getMonthlyReport(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.get('/getTechJobHistory', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTechJobHistory(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/delete-service-dept', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteServiceDept(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/delete-banner', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteBanner(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/deleteServiceDetails', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteServiceDetails(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});




router.get('/get-emplyoee', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getEmplyoee());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getOrderStatus', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getOrderStatus(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-cart-info', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getCartInfo(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getTechnicianDetailsinCart', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTechnicianDetailsinCart(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-profile', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getProfile(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-technician', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTechnician(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.get('/get-offer-service', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getOfferService());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-thought', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getThought(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-location', async function(req, res, next) {
  try {
    // 
    res.json(await programmingLanguages.getLocation(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-total-item', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTotalAddToCart(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getOrderSummary', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getOrderSummary(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getContact', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getContact());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getNotifiction', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getNotifiction(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getSearch', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getSearch(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/place-order', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.placeOrder(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.post('/set-pin', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setPin(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.post('/add-job', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.addJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/add-app-feedback', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.addAppFeedback(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/deleteLocation', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteLocation(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.get('/delete-thought', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteThought(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});




router.get('/delete-sub-service', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteSubService(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/get-job', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getJob());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/get-client', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getClient());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/get-client-details', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getClientDetail(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});




router.get('/getServicesAdminList', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getServicesAdminList(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.get('/get-client-address', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getClientAddress(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.post('/set-cancle', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setCancle(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.post('/assign-tech', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.assignTech(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/add-feedback', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.addFeedback(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.post('/rejectJob', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.rejectJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});




router.post('/setTechCancle', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setTechCancle(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getNonVerifyJobs', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getNonVerifyJobs(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getVerifyAdminJobs', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getVerifyAdminJobs(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getTechForCart', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTechForCart(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/acceptJob', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.acceptJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.post('/setOntheWay', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setOntheWay(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});



router.post('/editPersonDetails', upload.single('hold-file'), async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.editPersonDetails(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.post('/setHoldJob', upload.single('hold-file'), async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setHoldJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/setResumeJob', upload.single('resume-file'), async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.setResumeJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getUpcoming', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getUpcoming(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getCompleted', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getCompleted(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/deleteUser', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.deleteUser(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getJobDeatils', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getJobDeatils(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getTechJobDetails', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getTechJobDetails(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getJobOrderDeatils', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getJobOrderDeatils(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getPendingAction', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getPendingAction(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getMyBooking', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getMyBooking(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getOnGoingJob', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getOnGoingJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getCompletedTechJob', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getCompletedTechJob(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getServicesList', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getServicesList(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getCancle', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getCancle(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-sub-services', async function(req, res, next) {
  try {
    
    if(req.query.id==undefined){
      res.json(await programmingLanguages.getSubServices());
    }else{
      res.json(await programmingLanguages.getSubServicesFilter(req));
      
    }
    
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getSubServices', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getSubServices(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getSubServicesId', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getSubServicesById(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/get-services-department', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getServicesDepartment(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get('/getAddToCart', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getAddToCart(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/getMostBookServices', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.getMostBookServices());
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


router.get('/get-check', async function(req, res, next) {
  try {
    
    res.json(await programmingLanguages.checkAuth(req));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});


module.exports = router;