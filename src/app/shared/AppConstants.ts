export const staffRoles = [
    { id: 1, type: 'teaching' },
    { id: 2, type: 'non-teaching'}
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
    recipientType:['School', 'Teachers', 'Student'] 
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
  ]


