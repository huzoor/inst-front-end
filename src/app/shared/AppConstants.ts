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

export const leveTypes = {
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

