// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** 
 * @title DevMate
 * @dev Implements creating, updating, deleting and retrieving user profiles on
 * @author gyanlakshmi@gmail.com
 * DevMate
 */
contract DevMate {
    using Counters for Counters.Counter;
    Counters.Counter private hackIds;

    struct User {
        bool isActive;
        address user;
        address safeId; //Safe ID for Account Abstraction
        string github;
        bool isGithubVerified;
        string description;
        string tools;
        string languages;
        uint timeOfCreation;
    }

    struct Mentor {
        bool isActive;
        address mentor;
        address safeId; //Safe ID for Account Abstraction
        string github;
        bool isGithubVerified;
        string specialisation;
        string links;
        uint timeOfCreation;
    }

    struct Project {
        uint id;
        address[] hackers;
        string projectName;
        string technologies;
        string github;
        string videoLink;
        bool isVerfied;
    }

    address constant DUMMY_ADDRESS = 0x8090E825C6FEED75A2aB5bbBF098f01083B98090;
    mapping(address => User) public userMapping; //User address and details mapping
    mapping(address => Mentor) public mentorMapping;
    mapping(uint => Project) public projectIdMapping; //Mapping between team ID and team details
    mapping(address => uint[]) public hackerProjects; //Mapping between a hacker address and their projects/teams
    User[] users; //Array to store all the users
    Mentor[] mentors; //Array to store all the mentors

    /** 
     * @dev Register the profile of the user.
     */
    function registerUser(string memory _github, string memory _description,
        string memory _tools, string memory _languages) public returns(uint){
            address userAddress = msg.sender;
            require(
                userMapping[userAddress].timeOfCreation == 0, 
                "User already created a profile"
            );
            
            User memory newUser = User(true, userAddress, DUMMY_ADDRESS, _github, false,
            _description, _tools, _languages, block.timestamp);

            userMapping[userAddress] = newUser;
            users.push(newUser);
            return userMapping[userAddress].timeOfCreation;
    }

    /** 
     * @dev Register the profile of the mentor.
     */
    function registerMentor(string memory _github, string memory _specialisation,
        string memory _links) public returns(uint) {
            address mentorAddress = msg.sender;
            require(
                mentorMapping[mentorAddress].timeOfCreation == 0, 
                "Mentor already created a profile"
            );
            
            Mentor memory newMentor = Mentor(true, mentorAddress, DUMMY_ADDRESS, _github, false, 
            _specialisation, _links, block.timestamp);

            mentorMapping[mentorAddress] = newMentor;
            mentors.push(newMentor);
            return mentorMapping[mentorAddress].timeOfCreation;
    }

    /** 
     * @dev Update the user profile on chain.
     */
    function updateUserProfile(address _safeId, string memory _github, bool _isGithubVerified, string memory _description,
        string memory _tools, string memory _languages) public {
        
        address userAddress = msg.sender;
        
        require(
            userMapping[userAddress].isActive, 
            "User does not have an active profile"
        );

        userMapping[userAddress].safeId = _safeId;
        userMapping[userAddress].github = _github;
        userMapping[userAddress].isGithubVerified = _isGithubVerified;
        userMapping[userAddress].description = _description;
        userMapping[userAddress].tools = _tools;
        userMapping[userAddress].languages = _languages;

    }

    /** 
     * @dev Update the mentor profile on chain.
     */
    function updateMentorProfile(address _safeId, string memory _github, bool _isGithubVerified, string memory _specialisation,
        string memory _links) public {
        
        address mentorAddress = msg.sender;
        
        require(
            mentorMapping[mentorAddress].isActive, 
            "User does not have an active profile"
        );

        mentorMapping[mentorAddress].safeId = _safeId;
        mentorMapping[mentorAddress].github = _github;
        mentorMapping[mentorAddress].isGithubVerified = _isGithubVerified;
        mentorMapping[mentorAddress].specialisation = _specialisation;
        mentorMapping[mentorAddress].links = _links;

    }
    
    /** 
     * @dev Submit a new project
     */
    function registerTeam(address[] memory _hackers, string memory _projectName, 
        string memory _technologies, string memory _github, string memory _videoLink) public {

            //Check if all the hackers have created a profile
            for(uint i = 0; i < _hackers.length; i++) {
                require(userMapping[_hackers[i]].isActive, "Hacker is not actively registered");
            }

            hackIds.increment();
            uint id = hackIds.current();

            Project memory newTeam = Project(id, _hackers, _projectName, _technologies, _github, _videoLink, false);

            projectIdMapping[id] = newTeam;

            //Map each hacker with their submitted project ID
            for(uint i = 0; i < _hackers.length; i++) {
                hackerProjects[_hackers[i]].push(id);
            }

    }

    //Reward coins anonymously - through Semaphore. TBD

    /*** --------------READ FUNCTIONS--------------------------------- ***/
    /**
     * @dev Send a user address and get all the data belonging to a user
     * @param _userAddress : Address of the user
     */
    function getProfilePerUser(address _userAddress) public view
    returns(User memory){
        return userMapping[_userAddress];
    }

    /**
     * @dev Send a mentor address and get all the data belonging to a mentor
     * @param _mentorAddress : Address of the mentor
     */
    function getProfilePerMentor(address _mentorAddress) public view
    returns(Mentor memory){
        return mentorMapping[_mentorAddress];
    }

    /** 
     * @dev Returns all user's profiles.
     * @return address of all users on the platform 
    */ 
    function getAllUserProfiles() public view
            returns (User[] memory)
    {
        return users;
    }

    /** 
     * @dev Returns mentor profiles.
     * @return the details of all users on the platform 
    */ 
     function getAllMentorProfiles() public view
            returns (Mentor[] memory)
    {
        return mentors;
    }

    /** 
     * @dev Returns all the IDs of projects of the given member.
     * @return the IDs of the projects of a given member 
    */ 
     function getProjectIdsOfAUser(address _user) public view
            returns (uint[] memory)
    {
        return hackerProjects[_user];
    }

    /** 
     * @dev Returns the details of a project given an ID.
     * @return the details of a project given an ID
    */ 
     function getProjectsById(uint _id) public view
            returns (Project memory)
    {
        return projectIdMapping[_id];
    }


}