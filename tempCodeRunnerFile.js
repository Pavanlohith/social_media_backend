e")
          const x=await Comment.findOneAndUpdate({"postid":pid},req.body);
         res.send(x);

    }