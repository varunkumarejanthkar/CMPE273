var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var Expense = require('./services/Expense');
var ExpenseComment = require('./services/ExpenseComment');
var LoginUser = require('./services/login');
var SignupUser = require('./services/Signup');
var UpdateUserDetails = require('./services/updateUserDetails');
var GetAllUserDetails = require('./services/GetAllUserDetails');
var GetRecentActivityDetails = require('./services/GetRecentActivityDetails');
var CreateGroup = require('./services/createGroup');
var SettleUpExpenses = require('./services/settleUpExpenses');
var SaveFile = require('./services/SaveFile');
var connectMongoDB = require('./Utils/MongoDbConnect');

connectMongoDB();

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle');
            console.log(res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
//handleTopicRequest("post_book",Books)
handleTopicRequest("post_saveExpense",Expense)
handleTopicRequest("post_saveExpenseComment",ExpenseComment)
handleTopicRequest("Login_User",LoginUser)
handleTopicRequest("Signup_User",SignupUser)
handleTopicRequest("Update_User_Details",UpdateUserDetails)
handleTopicRequest("Get_All_User_Details",GetAllUserDetails)
handleTopicRequest("Get_RecentActivity_Details",GetRecentActivityDetails)
handleTopicRequest("Create_Group",CreateGroup)
handleTopicRequest("SettleUpExpenses",SettleUpExpenses)
handleTopicRequest("SaveFile",SaveFile)







