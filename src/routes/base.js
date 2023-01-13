function fail(res, msg, extra) {
    let result = { 'status': 1, 'message': msg };
    if (extra?.code) result.code = extra.code;
    if (extra?.data) result.data = extra.data;
    return res.json(result);
}

function succeed(res, extra) {
    let result = { 'status': 0, 'message': 'OK' };
    if (extra?.msg) result.msg = extra.msg;
    if (extra?.data !== undefined) result.data = extra.data;
    return res.json(result);
}

module.exports = {
    fail,
    succeed,
}