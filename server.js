const express = require("express");
const { readFileSync, existsSync, mkdirSync } = require("fs");
const multer = require("multer");
const path = require("path");

const port = 8000;
const app = express();
app.use(express.json());

// アップロード先のディレクトリを設定
const uploadDir = './uploads';
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
}

// Multerの設定
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // ファイル名をエンコードして保存
        const encodedName = decodeURI(file.originalname);
        cb(null, encodedName);
    }
});

const upload = multer({ storage: storage });

let comments = [{user: "Someone", comment: "ユーザー名とコメントを入力して送信"}];

app.get("/", (req, resp) => {
    resp.status(200).send(readFileSync("./index2.html", { encoding: "utf-8" }));
});

app.post("/addComment", upload.single('file'), (req, resp) => {
	//console.log(req.file.filename)
    const newComment = {
        user: req.body.user,
        comment: req.body.comment,
        file: req.file ? `/uploads/${req.file.filename}` : null
    };
    comments.push(newComment);
    resp.status(200).send();
});

app.get("/loadComments", (req, resp) => {
    resp.status(200).send(JSON.stringify(comments));
});

// ファイルを提供するためのエンドポイント
app.use('/uploads', express.static(uploadDir));

app.get("/resetComments", (req, resp) => {
    comments = [{user: "Someone", comment: "ユーザー名とコメントを入力して送信"}];
    resp.status(200).send();
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
