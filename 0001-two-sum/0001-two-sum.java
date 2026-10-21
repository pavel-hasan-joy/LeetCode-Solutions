import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> index
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[] { seen.get(need), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {}; // problem guarantees a solution, so never reached
    }
}