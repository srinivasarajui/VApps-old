'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ebTypeSchema = new Schema({
    code: {
        type: String,
        default: '',
        required: 'Please fill code',
        trim: true
    },
    l1Thickness: {
        type: String,
        default: '',
        required: 'Please Enter  l1Thickness',
        trim: true
    },
    l1Color: {
        type: String,
        default: '',
        required: 'Please enter L1 Colot',
        trim: true
    },
    w1Thickness: {
        type: String,
        default: '',
        required: 'Please Enter  w1Thickness',
        trim: true
    },
    w1Color: {
        type: String,
        default: '',
        required: 'Please enter w1 Colot',
        trim: true
    },
    l2Thickness: {
        type: String,
        default: '',
        required: 'Please Enter  l1Thickness',
        trim: true
    },
    l2Color: {
        type: String,
        default: '',
        required: 'Please enter L1 Colot',
        trim: true
    },
    w2Thickness: {
        type: String,
        default: '',
        required: 'Please Enter  w1Thickness',
        trim: true
    },
    w2Color: {
        type: String,
        default: '',
        required: 'Please enter w1 Colot',
        trim: true
    }
});
var PanelTypeSchema = new Schema({
    code: {
        type: String,
        default: '',
        required: 'Please fill code',
        trim: true
    },
    lamType: {
        type: String,
        default: '',
        required: 'Please lam type (Pre or Post)',
        trim: true
    },
    baseBoard: {
        type: String,
        default: '',
        required: 'Please Base Board',
        trim: true
    },
    lam1Color: {
        type: String,
        default: '',
        required: 'Please Base Board',
        trim: true
    },
    lam2Color: {
        type: String,
        default: '',

        trim: true
    }
});
var PanelSchema = new Schema({
    x: {
        type: Number,
        default: 0,
        required: 'Please Enter X'
    },
    y: {
        type: Number,
        default: 0,
        required: 'Please Enter Y',
        trim: true
    },
    qty: {
        type: Number,
        default: 1,
        required: 'Please enter Quantity',
        trim: true
    },
    panelType: {
        type: Schema.ObjectId,
        ref: 'PanelType'
    },
    ebType: {
        type: Schema.ObjectId,
        ref: 'ebType'
    },
    comments: {
        type: String,
        default: '',
        trim: true
    }
});
var ItemSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill code',
        trim: true
    },
    Panels: [PanelSchema]
});
var RoomSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill room name',
        trim: true
    },
    items: [ItemSchema]
});

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Project name',
        trim: true
    },
    ebTypes: [ebTypeSchema],
    panelTypes: [PanelTypeSchema],
    rooms: [RoomSchema],

    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Project', ProjectSchema);
