import { stringify } from 'qs';
import { request, file } from '../utils/request';

// user
export async function register(params) {
	return request('/account/register', {
		method: 'POST',
		body: params,
	});
}
export async function retrieve(params) {
	return request('/account/retrieve', {
		method: 'POST',
		body: params,
	});
}
export async function accountLogin(params) {
	return request('/account/login', {
		method: 'POST',
		body: params,
	});
}
export async function accountLogout(params) {
	return request('/account/logout', {
		method: 'POST',
		body: params,
	});
}
export async function queryUsers() {
	return request('/account');
}
export async function queryCurrent(params) {
	return request(`/account?${stringify(params)}`);
}
export async function updateUser(params) {
	return request('/account', {
		method: 'PUT',
		body: params,
	});
}
export async function uploadPicture(params) {
	return request('/account/portrait', {
		method: 'POST',
		headers : { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
		body: params,
	});
}
export async function getFile(params) {
	return request(`/getfile?${stringify(params)}`);
}

export async function getCaptcha(params) {
	return request(`/common/sms/`+params, {
		method: 'POST',
		body: params,
	});
}
// device
export async function getDeviceList(params) {
	return request(`/device/Device/ReadMore?${stringify(params)}`);
}
export async function getDeviceInfo(params) {
	return request(`/device/Device/ReadMore?IMEI=${params}`);
}
export async function getFileData(params) {
	return request(`/device/Runtime?&num=30&page=1&device_id=${params}`);
}
export async function getCtrlRuntime(params) {
	return request(`/device/Runtime?&num=1&page=1&type=8192&${stringify(params)}`);
}
export async function getDoorRuntime(params) {
	return request(`/device/Runtime?&${stringify(params)}`);
}
export async function getFloorData(params) {
	return request(`/device/Runtime?&num=1&page=1&type=8211&${stringify(params)}`);
}
export async function followDevice(IMEI, params) {
	return request(`/device/Device/ReadMore?${IMEI}?${stringify(params)}`,{
		method: 'POST',
		body: params,
	});
}
export function postFollowInfo(params) {
	return request('/device/follow', {
		method: 'POST',
		body: params,
	});
}
export function putFollowInfo(params) {
	return request('/device/Device', {
		method: 'PUT',
		body: params,
	});
}
export function getFault(params) {
	return request(`/device/Order?${stringify(params)}&follow=yes`);
}
export function getFaultUntreted(params) {
	return request(`/device/Order/Untreted?${stringify(params)}&follow=yes`);
}
export function postFault(params) {
	return request('/device/Order/receipt', {
		method: 'POST',
		body: params,
	});
}
export function deleteFault(params) {
	return request(`/device/Order?${stringify(params)}`, {
		method: 'DELETE',
	});
}
export function deleteFollowInfo(params) {
	return request(`/device/follow?${stringify(params)}`, {
		method: 'DELETE',
	});
}
export function getFollowInfo(params) {
	return request(`/documents/followInfo?${stringify(params)}`);
}
export function getDevices(params) {
	return request(`/device/Device/ReadMore?${stringify(params)}`);
}
export function getFollowDevices(params) {
	return request(`/device/Device/ReadMore?${stringify(params)}&follow=yes`);
}
export function getDevicesStatus(params) {
	return request(`/device/Device/ReadCountFollow?${stringify(params)}`);
}
export function getEvent(params) {
	return request(`/device/Event?${stringify(params)}`);
}
export function getHistoryEvent(params) {
	return request(`/device/Event?id=${params}`);
}
export function getDispatch(params) {
	return request(`/device/Dispatch?${stringify(params)}`);
}
export function postFinish(params) {
	return request('/device/Dispatch/finish', {
		method: 'POST',
		body: params,
	});
}
export function postLocation(params) {
	return request('/device/artlocation', {
		method: 'POST',
		body: params,
	});
}
export async function postMonitor(params) {
	return request('/device/Monitor', {
		method: 'POST',
		body: params,
	});
}
export async function postCall(params) {
	return request('/device/Call', {
		method: 'POST',
		body: params,
	});
}
// ladder
export function getLadder(params) {
	return request(`/device/Ladder/ReadMore?${stringify(params)}`);
}

// message
export async function queryMessage(params) {
	return request(`/common/message?${stringify(params)}`);
}
export async function deleteMessage(params) {
	return request(`/common/message?${stringify(params)}`,{
	 method: 'DELETE',
	});
}
export function getMessages(params) {
	return request(`/common/message?${stringify(params)}`);
}
export function getMessageCount(params) {
	return request(`/common/message/count?${stringify(params)}`);
}
export async function unreadMessage() {
	return request('/common/message/count');
}

//company
export async function rejectApply(params) {
	return request('/documents/company/reject', {
		method: 'POST',
		body: params,
	});
}
export async function acceptApply(params) {
	return request('/documents/company/accept', {
		method: 'POST',
		body: params,
	});
}
export async function newGroup(params) {
	return request('/documents/company', {
		method: 'POST',
		body: params,
	});
}
export async function readCompany(params) {
	return request(`/documents/company?${stringify(params)}`);
}
export async function readGroup() {
	return request('/account/company');
}
export async function joinGroup(params) {
	return request('/device/Organization/join', {
		method: 'PUT',
		body: params,
	});
}

// error code
export async function errorCode(params) {
	return request(`/events/errorCode?${stringify(params)}`);
}

export function getBanners(params) {
	return request(`/common/banner?${stringify(params)}`);
}



// statistic
export function getStatistic(params) {
	return request(`/mointors/statistic?${stringify(params)}`);
}

//command
export function getCommand(params) {
	return request(`/device/Command?${stringify(params)}`);
}

//orderCode
export function getOrderCode(params) {
	return request(`/device/OrderCode?${stringify(params)}`);
}
