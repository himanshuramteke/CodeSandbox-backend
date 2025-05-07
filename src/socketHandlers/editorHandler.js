import fs from "fs/promises";
import path from "path";
import { getContainerPort } from "../containers/handleContainerCreate.js";

export const handleEditorSocketEvents = (socket, editorNamespace) => {
    const emitError = (message) => {
        socket.emit("error", { data: message });
    };

    socket.on("writeFile", async ({ data, pathToFileOrFolder }) => {
        try {
            const dir = path.dirname(pathToFileOrFolder);
            await fs.mkdir(dir, { recursive: true });

            await fs.writeFile(pathToFileOrFolder, data);
            editorNamespace.emit("writeFileSuccess", {
                data: "File written successfully",
                path: pathToFileOrFolder,
            });
        } catch (error) {
            console.error("Error writing the file:", error);
            emitError("Error writing the file");
        }
    });

    socket.on("createFile", async ({ pathToFileOrFolder }) => {
        try {
            await fs.stat(pathToFileOrFolder);
            emitError("File already exists");
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error("Error checking file:", err);
                emitError("Error checking file existence");
                return;
            }

            try {
                const dir = path.dirname(pathToFileOrFolder);
                await fs.mkdir(dir, { recursive: true });
                await fs.writeFile(pathToFileOrFolder, "");
                socket.emit("createFileSuccess", {
                    data: "File created successfully",
                    path: pathToFileOrFolder,
                });
            } catch (error) {
                console.error("Error creating the file:", error);
                emitError("Error creating the file");
            }
        }
    });

    socket.on("readFile", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.readFile(pathToFileOrFolder);
            socket.emit("readFileSuccess", {
                value: response.toString(),
                path: pathToFileOrFolder,
            });
        } catch (error) {
            console.error("Error reading the file:", error);
            emitError("Error reading the file");
        }
    });

    socket.on("deleteFile", async ({ pathToFileOrFolder }) => {
        try {
            await fs.unlink(pathToFileOrFolder);
            socket.emit("deleteFileSuccess", {
                data: "File deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting the file:", error);
            emitError("Error deleting the file");
        }
    });

    socket.on("createFolder", async ({ pathToFileOrFolder }) => {
        try {
            await fs.mkdir(pathToFileOrFolder, { recursive: true });
            socket.emit("createFolderSuccess", {
                data: "Folder created successfully",
            });
        } catch (error) {
            console.error("Error creating the folder:", error);
            emitError("Error creating the folder");
        }
    });

    socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
        try {
            await fs.rm(pathToFileOrFolder, { recursive: true, force: true }); // safe replacement for deprecated rmdir
            socket.emit("deleteFolderSuccess", {
                data: "Folder deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting the folder:", error);
            emitError("Error deleting the folder");
        }
    });

    socket.on("renameFolder", async ({ oldPath, newPath }) => {
        try {
            await fs.rename(oldPath, newPath);
            socket.emit("renameFolderSuccess", {
                data: "Folder renamed successfully",
                oldPath,
                newPath,
            });
        } catch (error) {
            console.error("Error renaming the folder:", error);
            emitError("Error renaming the folder");
        }
    });

    socket.on("renameFile", async ({ oldPath, newPath }) => {
        try {
            await fs.rename(oldPath, newPath);
            socket.emit("renameFileSuccess", {
                data: "File renamed successfully",
                oldPath,
                newPath,
            });
        } catch (error) {
            console.error("Error renaming the file:", error);
            emitError("Error renaming the file");
        }
    });

    socket.on("getPort", async ({ containerName }) => {
        try {
            const port = await getContainerPort(containerName);
            console.log("Container port:", port);
            socket.emit("getPortSuccess", { port });
        } catch (error) {
            console.error("Error getting container port:", error);
            emitError("Error getting container port");
        }
    });
};
