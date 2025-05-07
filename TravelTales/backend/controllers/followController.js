const db = require('../database/db');

exports.followUser = (req, res) => {
  const followerId = req.user.id; 
  const { followeeId } = req.body;

  if (!followeeId) {
    return res.status(400).json({ message: 'Followee ID is required.' });
  }

  if (followerId === followeeId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  // Check if already following
  db.get(
    `SELECT * FROM follows WHERE follower_id = ? AND followee_id = ?`,
    [followerId, followeeId],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (row) {
        // Already following — so unfollow (toggle)
        db.run(
          `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`,
          [followerId, followeeId],
          function (err) {
            if (err) return res.status(500).json({ message: 'Unfollow failed', error: err });
            return res.status(200).json({ message: 'Unfollowed successfully' });
          }
        );
      } else {
      
        db.run(
          `INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)`,
          [followerId, followeeId],
          function (err) {
            if (err) return res.status(500).json({ message: 'Follow failed', error: err });
            return res.status(201).json({ message: 'Followed successfully' });
          }
        );
      }
    }
  );
};

// Get followers of a user
exports.getFollowers = (req, res) => {
  const userId = req.params.id;

  db.all(
    `SELECT users.id, users.email FROM follows 
     JOIN users ON follows.follower_id = users.id 
     WHERE follows.followee_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching followers', error: err });
      res.json({ followers: rows });
    }
  );
};

// Get followees (who the user follows)
exports.getFollowees = (req, res) => {
  const userId = req.params.id;

  db.all(
    `SELECT users.id, users.email FROM follows 
     JOIN users ON follows.followee_id = users.id 
     WHERE follows.follower_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching followees', error: err });
      res.json({ following: rows });
    }
  );
};
