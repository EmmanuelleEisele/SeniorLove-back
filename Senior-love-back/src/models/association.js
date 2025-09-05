import { Activity } from "./Activity.js";
import { User } from "./User.js";
import { Event } from "./Event.js";
import { Localisation } from "./Localisation.js";
import { Category } from "./Category.js";
import { Conversation } from "./Conversation.js";
import { RefreshToken } from "./RefreshToken.js";

//User 0,N -> Activity 0,N
User.belongsToMany(Activity, {
    through: "user_activity",
    foreignKey: "user_id",
    otherKey: "activity_id",
    as: "activities",
    onDelete: "CASCADE",
});

Activity.belongsToMany(User, {
    through: "user_activity",
    foreignKey: "activity_id",
    otherKey: "user_id",
    as: "users",
    onDelete: "CASCADE",
});

// Event 0,N -> Activity 0,N
Event.belongsToMany(Activity, {
    through: "event_activity",
    foreignKey: "event_id",
    otherKey: "activity_id",
    as: "activities",
    onDelete: "CASCADE",
});

Activity.belongsToMany(Event, {
    through: "event_activity",
    foreignKey: "activity_id",
    otherKey: "event_id",
    as: "events",
    onDelete: "CASCADE",
});

// User 0,N -> Event 0,N
User.belongsToMany(Event, {
    through: "user_event",
    foreignKey: "user_id",
    otherKey: "event_id",
    as: "events",
    onDelete: "CASCADE",
});

Event.belongsToMany(User, {
    through: "user_event",
    foreignKey: "event_id",
    otherKey: "user_id",
    as: "users",
    onDelete: "CASCADE",
});

User.hasMany(Conversation, {
    foreignKey: "sender_id",
    as: "sentMessages",
});

User.hasMany(Conversation, {
    foreignKey: "receiver_id",
    as: "receivedMessages",
});

Conversation.belongsTo(User, {
    foreignKey: "sender_id",
    as: "sender",
});

Conversation.belongsTo(User, {
    foreignKey: "receiver_id",
    as: "receiver",
});

// User 1,1 -> Localisation 0, N
User.belongsTo(Localisation, {
    foreignKey: "localisation_id",
    as: "localisation",
});

Localisation.hasMany(User, {
    foreignKey: "localisation_id",
    as: "users",
});

// Activity 1,1 -> Category 0, N
Activity.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
});

Category.hasMany(Activity, {
    foreignKey: "category_id",
    as: "activities",
});

// Event 1,1 -> Localisation 0, N
Event.belongsTo(Localisation, {
    foreignKey: "localisation_id",
    as: "localisation",
});

Localisation.hasMany(Event, {
    foreignKey: "localisation_id",
    as: "events",
});

// User 1,1 -> RefreshToken 0,N
User.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

export { Activity, User, Event, Localisation, Category, Conversation, RefreshToken };
