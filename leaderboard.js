PlayerList = new Mongo.Collection('players');
PlayerList.find().fetch();

if(Meteor.isClient){
  //this code only runs on the client
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayerList.find({}, {sort: {score: -1, name: -1}});
    },
    'selectedClass' : function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId==selectedPlayer){
        return "selected"
      }
    },
    'showSelectedPlayer' : function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayerList.findOne(selectedPlayer);
    },
  });

  Template.leaderboard.events({
    'click .player' : function(){
        var playerId = this._id;
        Session.set('selectedPlayer', playerId);
    },
    'click .increment' : function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update(selectedPlayer, {$inc: {score: 5} });
    },
    'click .decrement' : function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update(selectedPlayer, {$inc: {score: -5} });
    },
    'click .remove' : function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.remove(selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(){
        event.preventDefault();
        var playerNameVar = event.target.playerName.value;
        var currentUserId = Meteor.userId();
        PlayerList.insert({
          name: playerNameVar,
          score: 0,
          createdBy: currentUserId
        });
    }
  })
  Meteor.subscribe('thePlayers');
}
if(Meteor.isServer){
Meteor.publish('thePlayers', function(){
  var currentUserId = this.userId;
  return PlayerList.find({createdBy: currentUserId})
  });
}

