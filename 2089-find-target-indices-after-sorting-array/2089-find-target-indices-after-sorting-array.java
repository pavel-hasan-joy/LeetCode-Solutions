class Solution {
    public List<Integer> targetIndices(int[] nums, int target) {
        int less = 0, equal = 0;

        for (int num : nums) {
            if (num < target) less++;
            else if (num == target) equal++;
        }

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < equal; i++) {
            result.add(less + i);
        }
        return result;
    }
}