const seasonEnum = {
	fall: 3,
	spring: 2,
	winter: 1
};

const sortByIssue = (a, b) => {
	let aIssue = a.prettyIssue || a.issue || "";
	let bIssue = b.prettyIssue || b.issue || "";

	let aArr = aIssue.split(" ").map(e => e.trim());
	let bArr = bIssue.split(" ").map(e => e.trim());

	if (aArr.length < 2 || bArr.length < 2) {
		return 0; // bad result
	}
	aArr[0] = aArr[0].toString().toLowerCase();
	aArr[1] = +aArr[1] || 0;
	bArr[0] = bArr[0].toString().toLowerCase();
	bArr[1] = +bArr[1] || 0;

	if (aArr[1] > bArr[1]) {
		return 1;
	} else if (aArr[1] < bArr[1]) {
		return -1;
	} else {
		if (!(aArr[0] in seasonEnum) || !(bArr[0] in seasonEnum)) {
			return 1;
		} else {
			if (seasonEnum[aArr[0]] > seasonEnum[bArr[0]]) {
				return 1;
			} else if (seasonEnum[aArr[0]] < seasonEnum[bArr[0]]) {
				return -1;
			} else {
				return 0;
			}
		}
	}
};

const sortByIssueReversed = (a, b) => sortByIssue(b, a);

module.exports = {
	sortByIssue: sortByIssue,
	sortByIssueReversed: sortByIssueReversed
};
