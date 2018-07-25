// export const serviceUrl = `http://ec2-18-218-136-200.us-east-2.compute.amazonaws.com:26666/api`;
// export const imageBaseUri = `http://ec2-18-218-136-200.us-east-2.compute.amazonaws.com:26666/`;

// export const serviceUrl = `http://18.218.136.200:26666/api`;
// export const imageBaseUri = `http://18.218.136.200:26666/`;

export const serviceUrl = `http://localhost:26666/api`;
export const imageBaseUri = `http://localhost:26666/`;

export const validation = {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/
}

export const staffRoles = [
    { id: 1, type: 'Teaching' },
    { id: 2, type: 'Non-Teaching'}
];

export const nonTechingDesignations = [
    { _id: 'ExamSection', designation: 'ExamSection' },
    { _id: 'OfficeBoy', designation: 'OfficeBoy' }
];

export const staffQualifications = [
    { id: 1, type: 'M.Tech' },
    { id: 2, type: 'M.Sc' },
    { id: 3, type: 'M.Ed' },
    { id: 4, type: 'B.Tech'}
];

export const countriesList = [
    {"name": "INDIA", "code": "IND"} 
];

export const statesList = [
    {"name": "AP", "code": "AP", "countryCode":"IND"},
    {"name": "KN", "code": "KN", "countryCode":"IND"}
];

export const districtsList = [
    {"name": "KDP", "code": "KDP", "stateCode":"AP"}, 
    {"name": "ATP", "code": "ATP", "stateCode":"AP"}, 
    {"name": "NLR", "code": "NLR", "stateCode":"AP"}, 
    {"name": "BLR", "code": "BLR", "stateCode":"KN"}, 
    {"name": "MSR", "code": "MSR", "stateCode":"KN"}, 
];

export const timeLineConfig = {
    messageTypes:['News', 'Circular'],
    recipientType:[ 'All', 'School', 'Teaching', 'Non-Teaching' ,'Student'] 
}

export const leaveTypes = {
  student: [
        { type:'CL', desc:'Casual Leve'},
        { type:'SL', desc:'Sick Leve'},
    ],
  nonStudent: [
    { type:'CL', desc:'Casual Leve'},
    { type:'SL', desc:'Sick Leve'},
    { type:'ML', desc:'Metarnity Leve'},
    { type:'PL', desc:'Peternity Leve'},
  ]
}

export const examTypes =  [
    { type:'UT1', desc:'UNIT-TEST I'},
    { type:'UT2', desc:'UNIT-TEST II'},
    { type:'UT3', desc:'UNIT-TEST III'},
    { type:'UT4', desc:'UNIT-TEST IV'},
    { type:'UT5', desc:'UNIT-TEST V'},
    { type:'UT6', desc:'UNIT-TEST VI'},
    { type:'QY', desc:'QUART YEARLY'},
    { type:'HY', desc:'HALF YEARLY'},
    { type:'YY', desc:'Annual Exam'},
  ];

let currYr:number = (new Date().getUTCFullYear());
export const yearsList = Array.from({length: 60}, (v, k) => currYr-k); 

export const daysList = ['MON','TUE','WED','THU','FRI','SAT'];
export const periodTimings = [
                                { 
                                    periodTime: '10AM - 11AM',
                                    periodName: 'first'
                                },
                                { 
                                    periodTime: '11AM - 12PM',
                                    periodName: 'second'
                                },
                                { 
                                    periodTime: '12PM - 01PM',
                                    periodName: 'third'
                                },
                               
                             ];


