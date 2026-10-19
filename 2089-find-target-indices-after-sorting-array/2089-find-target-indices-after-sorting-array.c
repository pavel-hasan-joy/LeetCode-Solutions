#include <stdlib.h>

int* targetIndices(int* nums, int numsSize, int target, int* returnSize) {
    int less = 0, equal = 0;

    for (int i = 0; i < numsSize; i++) {
        if (nums[i] < target) less++;
        else if (nums[i] == target) equal++;
    }

    *returnSize = equal;

    if (equal == 0) {
        return NULL;
    }

    int* result = (int*)malloc(equal * sizeof(int));
    for (int i = 0; i < equal; i++) {
        result[i] = less + i;
    }
    return result;
}