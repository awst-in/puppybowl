/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2108-LSU-RM-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2108-LSU-RM-WEB-PT/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}players`);
    const {
      data: { players },
    } = await response.json();
    return players;
  } catch (error) {
    console.error('No, bad dog!', error.message);
  }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(
          `${APIURL}players/${playerId}`
        );
        const result = await response.json();
        return result.data.player
      } catch (err) {
        console.error(err);
      }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
  } catch (error) {
    console.error('Error adding a new player', error.message);
  }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (result.error) throw result.error;
        return;
       } catch (err) {
        console.error(
          `Whoops, trouble removing player #${playerId} from the roster!`,
          err
        );
       }
};


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="delete-button" data-id=${pup.id}>Remove from roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
      const puppyObj = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(button.dataset.id);

      return await renderSinglePlayer(puppyObj);
    });
  }

  let deleteButtons = [...document.getElementsByClassName('delete-button')];
  for (let i = 0; i < deleteButtons.length; i++) {
    const button = deleteButtons[i];
    button.addEventListener('click', async () => {
      await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);
      const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
      renderAllPlayers(players);
    });
  }
};

const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'} <select name="team">
      <option value=39>Ruff</option>
      <option value=40>Fluff</option>
    </select>
    </p>
      <p>Breed: ${playerObj.breed}</p>
      <p>Teammates: ${getTeammates(playerObj)}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${playerObj.name} the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;
  playerContainer.innerHTML = pupHTML;
  let backButton = document.getElementById('see-all');
  const button = backButton;
  button.addEventListener('click', async () => {
    renderAllPlayers(await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)());
  });
};

const getTeammates = (playerObj) => {
  let teamList = playerObj.team.players
  let teamMates = [];
  for(let i = 0; i < teamList.length; i++){
    if (teamList[i].id === playerObj.id) {
      continue
    } else { 
      teamMates.push(teamList[i].name)
    }
  }
  return teamMates.join(', ');
}

const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <label for="team">Team:</label>
      <select name="team">
        <option value=39>Ruff</option>
        <option value=40>Fluff</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPlayer = {
      name: form.elements.name.value,
      breed: form.elements.breed.value,
      teamId: form.elements.team.value
    };
    await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(newPlayer);
    const allPlayers = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
    renderAllPlayers(allPlayers);
    form.elements.name.value = '';
    form.elements.breed.value = '';
    form.elements.team.value = '';
  });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
  (0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players);

  (0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)();
}

init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsYUFBYSxPQUFPLFVBQVUsU0FBUztBQUN2QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxvQ0FBb0MsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSx3Q0FBd0MsT0FBTyxXQUFXLFNBQVM7QUFDbkU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsOENBQThDLFNBQVM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFEK0Y7O0FBRS9GO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUMsbUNBQW1DLE9BQU87QUFDMUM7QUFDQSxvQkFBb0IsYUFBYSxrQkFBa0IsU0FBUztBQUM1RCxnREFBZ0QsT0FBTztBQUN2RCxnREFBZ0QsT0FBTztBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBO0FBQ0EsNkJBQTZCLCtEQUFpQjs7QUFFOUM7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7QUFDQSxZQUFZLDBEQUFZO0FBQ3hCLDRCQUE0Qiw2REFBZTtBQUMzQztBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGVBQWU7QUFDOUMsaUNBQWlDLGFBQWE7QUFDOUM7QUFDQSxpQkFBaUIsb0RBQW9EO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQyxzQkFBc0Isd0JBQXdCO0FBQzlDLGtCQUFrQixtQkFBbUIsa0JBQWtCLGVBQWU7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsNkRBQWU7QUFDMUMsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixxQkFBcUI7QUFDckM7QUFDQTtBQUNBLEtBQUssTztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDBEQUFZO0FBQ3RCLDZCQUE2Qiw2REFBZTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7OztVQ3RJQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOOEM7QUFDd0I7O0FBRXRFO0FBQ0Esd0JBQXdCLDZEQUFlO0FBQ3ZDLEVBQUUsZ0VBQWdCOztBQUVsQixFQUFFLG1FQUFtQjtBQUNyQjs7QUFFQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBZGQgeW91ciBjb2hvcnQgbmFtZSB0byB0aGUgY29ob3J0TmFtZSB2YXJpYWJsZSBiZWxvdywgcmVwbGFjaW5nIHRoZSAnQ09IT1JULU5BTUUnIHBsYWNlaG9sZGVyXG5jb25zdCBjb2hvcnROYW1lID0gJzIxMDgtTFNVLVJNLVdFQi1QVCc7XG4vLyBVc2UgdGhlIEFQSVVSTCB2YXJpYWJsZSBmb3IgZmV0Y2ggcmVxdWVzdHNcbmNvbnN0IEFQSVVSTCA9IGBodHRwczovL2ZzYS1wdXBweS1ib3dsLmhlcm9rdWFwcC5jb20vYXBpLzIxMDgtTFNVLVJNLVdFQi1QVC9gO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hBbGxQbGF5ZXJzID0gYXN5bmMgKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfXBsYXllcnNgKTtcbiAgICBjb25zdCB7XG4gICAgICBkYXRhOiB7IHBsYXllcnMgfSxcbiAgICB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBwbGF5ZXJzO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ05vLCBiYWQgZG9nIScsIGVycm9yLm1lc3NhZ2UpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVQbGF5ZXIgPSBhc3luYyAocGxheWVySWQpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgIGAke0FQSVVSTH1wbGF5ZXJzLyR7cGxheWVySWR9YFxuICAgICAgICApO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQuZGF0YS5wbGF5ZXJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkTmV3UGxheWVyID0gYXN5bmMgKHBsYXllck9iaikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfXBsYXllcnNgLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwbGF5ZXJPYmopLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhZGRpbmcgYSBuZXcgcGxheWVyJywgZXJyb3IubWVzc2FnZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVQbGF5ZXIgPSBhc3luYyAocGxheWVySWQpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSVVSTH0vcGxheWVycy8ke3BsYXllcklkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIHJldHVybjtcbiAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBgV2hvb3BzLCB0cm91YmxlIHJlbW92aW5nIHBsYXllciAjJHtwbGF5ZXJJZH0gZnJvbSB0aGUgcm9zdGVyIWAsXG4gICAgICAgICAgZXJyXG4gICAgICAgICk7XG4gICAgICAgfVxufTtcbiIsImltcG9ydCB7IGFkZE5ld1BsYXllciwgZmV0Y2hBbGxQbGF5ZXJzLCBmZXRjaFNpbmdsZVBsYXllciwgcmVtb3ZlUGxheWVyIH0gZnJvbSAnLi9hamF4SGVscGVycyc7XG5cbmNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGwtcGxheWVycy1jb250YWluZXInKTtcbmNvbnN0IG5ld1BsYXllckZvcm1Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXBsYXllci1mb3JtJyk7XG5cbmV4cG9ydCBjb25zdCByZW5kZXJBbGxQbGF5ZXJzID0gKHBsYXllckxpc3QpID0+IHtcbiAgLy8gRmlyc3QgY2hlY2sgaWYgd2UgaGF2ZSBhbnkgZGF0YSBiZWZvcmUgdHJ5aW5nIHRvIHJlbmRlciBpdCFcbiAgaWYgKCFwbGF5ZXJMaXN0IHx8ICFwbGF5ZXJMaXN0Lmxlbmd0aCkge1xuICAgIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSAnPGgzPk5vIHBsYXllcnMgdG8gZGlzcGxheSE8L2gzPic7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0IG9mIHBsYXllcnMsIGFuZCBjb25zdHJ1Y3Qgc29tZSBIVE1MIHRvIGRpc3BsYXkgZWFjaCBvbmVcbiAgbGV0IHBsYXllckNvbnRhaW5lckhUTUwgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHVwID0gcGxheWVyTGlzdFtpXTtcbiAgICBsZXQgcHVwSFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLWNhcmRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1pbmZvXCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJwdXAtdGl0bGVcIj4ke3B1cC5uYW1lfTwvcD5cbiAgICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwdXAuaWR9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGltZyBzcmM9XCIke3B1cC5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke3B1cC5uYW1lfSB0aGUgcHVwcHlcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRldGFpbC1idXR0b25cIiBkYXRhLWlkPSR7cHVwLmlkfT5TZWUgZGV0YWlsczwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGVsZXRlLWJ1dHRvblwiIGRhdGEtaWQ9JHtwdXAuaWR9PlJlbW92ZSBmcm9tIHJvc3RlcjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgYDtcbiAgICBwbGF5ZXJDb250YWluZXJIVE1MICs9IHB1cEhUTUw7XG4gIH1cblxuICAvLyBBZnRlciBsb29waW5nLCBmaWxsIHRoZSBgcGxheWVyQ29udGFpbmVyYCBkaXYgd2l0aCB0aGUgSFRNTCB3ZSBjb25zdHJ1Y3RlZCBhYm92ZVxuICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gcGxheWVyQ29udGFpbmVySFRNTDtcblxuICAvLyBOb3cgdGhhdCB0aGUgSFRNTCBmb3IgYWxsIHBsYXllcnMgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIERPTSxcbiAgLy8gd2Ugd2FudCB0byBncmFiIHRob3NlIFwiU2VlIGRldGFpbHNcIiBidXR0b25zIG9uIGVhY2ggcGxheWVyXG4gIC8vIGFuZCBhdHRhY2ggYSBjbGljayBoYW5kbGVyIHRvIGVhY2ggb25lXG4gIGxldCBkZXRhaWxCdXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RldGFpbC1idXR0b24nKV07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGV0YWlsQnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRldGFpbEJ1dHRvbnNbaV07XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcHVwcHlPYmogPSBhd2FpdCBmZXRjaFNpbmdsZVBsYXllcihidXR0b24uZGF0YXNldC5pZCk7XG5cbiAgICAgIHJldHVybiBhd2FpdCByZW5kZXJTaW5nbGVQbGF5ZXIocHVwcHlPYmopO1xuICAgIH0pO1xuICB9XG5cbiAgbGV0IGRlbGV0ZUJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVsZXRlLWJ1dHRvbicpXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxldGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZGVsZXRlQnV0dG9uc1tpXTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCByZW1vdmVQbGF5ZXIoYnV0dG9uLmRhdGFzZXQuaWQpO1xuICAgICAgY29uc3QgcGxheWVycyA9IGF3YWl0IGZldGNoQWxsUGxheWVycygpO1xuICAgICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlclNpbmdsZVBsYXllciA9IChwbGF5ZXJPYmopID0+IHtcbiAgaWYgKCFwbGF5ZXJPYmogfHwgIXBsYXllck9iai5pZCkge1xuICAgIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBcIjxoMz5Db3VsZG4ndCBmaW5kIGRhdGEgZm9yIHRoaXMgcGxheWVyITwvaDM+XCI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHB1cEhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInNpbmdsZS1wbGF5ZXItdmlld1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1pbmZvXCI+XG4gICAgICAgIDxwIGNsYXNzPVwicHVwLXRpdGxlXCI+JHtwbGF5ZXJPYmoubmFtZX08L3A+XG4gICAgICAgIDxwIGNsYXNzPVwicHVwLW51bWJlclwiPiMke3BsYXllck9iai5pZH08L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxwPlRlYW06ICR7cGxheWVyT2JqLnRlYW0gPyBwbGF5ZXJPYmoudGVhbS5uYW1lIDogJ1VuYXNzaWduZWQnfSA8c2VsZWN0IG5hbWU9XCJ0ZWFtXCI+XG4gICAgICA8b3B0aW9uIHZhbHVlPTM5PlJ1ZmY8L29wdGlvbj5cbiAgICAgIDxvcHRpb24gdmFsdWU9NDA+Rmx1ZmY8L29wdGlvbj5cbiAgICA8L3NlbGVjdD5cbiAgICA8L3A+XG4gICAgICA8cD5CcmVlZDogJHtwbGF5ZXJPYmouYnJlZWR9PC9wPlxuICAgICAgPHA+VGVhbW1hdGVzOiAke2dldFRlYW1tYXRlcyhwbGF5ZXJPYmopfTwvcD5cbiAgICAgIDxpbWcgc3JjPVwiJHtwbGF5ZXJPYmouaW1hZ2VVcmx9XCIgYWx0PVwicGhvdG8gb2YgJHtwbGF5ZXJPYmoubmFtZX0gdGhlIHB1cHB5XCI+XG4gICAgICA8YnV0dG9uIGlkPVwic2VlLWFsbFwiPkJhY2sgdG8gYWxsIHBsYXllcnM8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgcGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9IHB1cEhUTUw7XG4gIGxldCBiYWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlZS1hbGwnKTtcbiAgY29uc3QgYnV0dG9uID0gYmFja0J1dHRvbjtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgIHJlbmRlckFsbFBsYXllcnMoYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCkpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdldFRlYW1tYXRlcyA9IChwbGF5ZXJPYmopID0+IHtcbiAgbGV0IHRlYW1MaXN0ID0gcGxheWVyT2JqLnRlYW0ucGxheWVyc1xuICBsZXQgdGVhbU1hdGVzID0gW107XG4gIGZvcihsZXQgaSA9IDA7IGkgPCB0ZWFtTGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgaWYgKHRlYW1MaXN0W2ldLmlkID09PSBwbGF5ZXJPYmouaWQpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfSBlbHNlIHsgXG4gICAgICB0ZWFtTWF0ZXMucHVzaCh0ZWFtTGlzdFtpXS5uYW1lKVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGVhbU1hdGVzLmpvaW4oJywgJyk7XG59XG5cbmV4cG9ydCBjb25zdCByZW5kZXJOZXdQbGF5ZXJGb3JtID0gKCkgPT4ge1xuICBsZXQgZm9ybUhUTUwgPSBgXG4gICAgPGZvcm0+XG4gICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWU6PC9sYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgLz5cbiAgICAgIDxsYWJlbCBmb3I9XCJicmVlZFwiPkJyZWVkOjwvbGFiZWw+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYnJlZWRcIiAvPlxuICAgICAgPGxhYmVsIGZvcj1cInRlYW1cIj5UZWFtOjwvbGFiZWw+XG4gICAgICA8c2VsZWN0IG5hbWU9XCJ0ZWFtXCI+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9Mzk+UnVmZjwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uIHZhbHVlPTQwPkZsdWZmPC9vcHRpb24+XG4gICAgICA8L3NlbGVjdD5cbiAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgIDwvZm9ybT5cbiAgYDtcbiAgbmV3UGxheWVyRm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBmb3JtSFRNTDtcblxuICBsZXQgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctcGxheWVyLWZvcm0gPiBmb3JtJyk7XG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG5ld1BsYXllciA9IHtcbiAgICAgIG5hbWU6IGZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSxcbiAgICAgIGJyZWVkOiBmb3JtLmVsZW1lbnRzLmJyZWVkLnZhbHVlLFxuICAgICAgdGVhbUlkOiBmb3JtLmVsZW1lbnRzLnRlYW0udmFsdWVcbiAgICB9O1xuICAgIGF3YWl0IGFkZE5ld1BsYXllcihuZXdQbGF5ZXIpO1xuICAgIGNvbnN0IGFsbFBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcbiAgICByZW5kZXJBbGxQbGF5ZXJzKGFsbFBsYXllcnMpO1xuICAgIGZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSA9ICcnO1xuICAgIGZvcm0uZWxlbWVudHMuYnJlZWQudmFsdWUgPSAnJztcbiAgICBmb3JtLmVsZW1lbnRzLnRlYW0udmFsdWUgPSAnJztcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge2ZldGNoQWxsUGxheWVyc30gZnJvbSAnLi9hamF4SGVscGVycyc7XG5pbXBvcnQge3JlbmRlckFsbFBsYXllcnMsIHJlbmRlck5ld1BsYXllckZvcm19IGZyb20gJy4vcmVuZGVySGVscGVycyc7XG5cbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcbiAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcblxuICByZW5kZXJOZXdQbGF5ZXJGb3JtKCk7XG59XG5cbmluaXQoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=