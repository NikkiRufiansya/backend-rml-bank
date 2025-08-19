const Event = require('../models/event');
const Account = require('../models/account');

const getAllEvent = async (req, res) => {
    try {
        const event = await Event.findAll();
        res.json(event);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const createEvent = async (req,res) => {
    try {
        const {email, status, token_status, token} = req.body;
        const newEvent = await Event.create ({email, status, token_status, token});
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const getEventById = async (req,res) => {
    try {
        const {id} = req.params;
        const event = await Event.findByPk(id);
        if (event) {
            res.json(event);
        }else{
            res.status(404).json({ error: 'Data not found'})
        }
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

const deleteEvent = async (req,res) => {
    try {
        const {id} = req.params;
        const deleted = await Event.destroy({
            where: {id}
        });
        if(deleted){
            res.status(204).end();
        } else {
            res.status(404).json({error: error.message});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    getAllEvent,
    createEvent,
    getEventById,
    deleteEvent
};