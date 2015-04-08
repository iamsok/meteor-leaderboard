PlayerList = new Mongo.Collection('players');

if(Meteor.isClient){
  //this code only runs on the client
  Template.leaderboard.helpers({
    'player': function(){
      return PlayerList.find()
    },
  });
  Template.leaderboard.events({
    'click .player' : function(){
      console.log("You clicked a .player element");
    }
  });
}
