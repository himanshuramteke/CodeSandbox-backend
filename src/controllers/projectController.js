import { createProjectService, getProjectTreeService } from "../service/projectService.js";


export const createProjectController = async (req, res) => {
    
    const projectId = await createProjectService();
   
    return res.json({ message: 'Project created', data: projectId});
    
}

export const getProjectTreeController = async (req, res) => {

    const tree = await getProjectTreeService(req.params.projectId);
    return res.json(200).json({
        data: tree,
        success: true,
        message: 'Successfully fetched the tree'
    })
}