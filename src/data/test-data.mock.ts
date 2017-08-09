
/**
 * THIS IS ONLY A MOCK DATA TO TEST THE BEHAVIOUR.
 */
const EXAM_DATA = {
    'testId': 1,
    'language': 'JAVA',
    'questions': [

        {
            'id': 1,
            'question': 'Given an array of  integers, can you find the sum of its elements?',
            'code': `
import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;

public class Solution {

    static int simpleArraySum(int n, int[] ar) {
        // Complete this function
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] ar = new int[n];
        for(int ar_i = 0; ar_i < n; ar_i++){
            ar[ar_i] = in.nextInt();
        }
        int result = simpleArraySum(n, ar);
        System.out.println(result);
    }
}`
        },

        {
            'id': 2,
            'question': 'question2',
            'code': 'this is the code for q 2'

        },

        {
            'id': 3,
            'question': 'question3',
            'code': 'this is the code for q3'

        }

    ]
};

export default EXAM_DATA;